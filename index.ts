const STORAGE_FILE = ".weather.json";

type Unit = "celsius" | "fahrenheit";

type City = {
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
};

type AppData = {
  cities: City[];
  defaultCity: string | null;
  unit: Unit;
};

type GeocodingResult = {
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
};

type WeatherResponse = {
  current?: {
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    wind_speed_10m: number;
    weather_code: number;
  };
};

const DEFAULT_DATA: AppData = {
  cities: [],
  defaultCity: null,
  unit: "celsius",
};

async function loadData(): Promise<AppData> {
  const file = Bun.file(STORAGE_FILE);
  if (!(await file.exists())) return { ...DEFAULT_DATA, cities: [] };

  try {
    const stored = JSON.parse(await file.text()) as Partial<AppData>;
    return {
      cities: Array.isArray(stored.cities) ? stored.cities : [],
      defaultCity: stored.defaultCity ?? null,
      unit: stored.unit === "fahrenheit" ? "fahrenheit" : "celsius",
    };
  } catch {
    return { ...DEFAULT_DATA, cities: [] };
  }
}

async function saveData(data: AppData): Promise<void> {
  await Bun.write(STORAGE_FILE, JSON.stringify(data, null, 2));
}

async function geocodeCity(query: string): Promise<City | null> {
  const params = new URLSearchParams({
    name: query,
    count: "1",
    language: "es",
    format: "json",
  });
  const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?${params}`);
  if (!response.ok) throw new Error("No se pudo consultar la ubicación.");

  const data = (await response.json()) as { results?: GeocodingResult[] };
  const result = data.results?.[0];
  if (!result) return null;

  return {
    name: result.name,
    latitude: result.latitude,
    longitude: result.longitude,
    country: result.country,
  };
}

function weatherDescription(code: number): string {
  if (code === 0) return "Despejado";
  if ([1, 2, 3].includes(code)) return "Parcialmente nublado";
  if ([45, 48].includes(code)) return "Niebla";
  if ([51, 53, 55, 56, 57].includes(code)) return "Llovizna";
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return "Lluvia";
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "Nieve";
  if ([95, 96, 99].includes(code)) return "Tormenta";
  return "Condición desconocida";
}

async function showWeather(city: City, unit: Unit): Promise<void> {
  const params = new URLSearchParams({
    latitude: String(city.latitude),
    longitude: String(city.longitude),
    current: "temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,weather_code",
    temperature_unit: unit,
    wind_speed_unit: "kmh",
  });
  const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
  if (!response.ok) throw new Error("No se pudo consultar el clima.");

  const data = (await response.json()) as WeatherResponse;
  const current = data.current;
  if (!current) throw new Error("La API no devolvió datos del clima.");

  const symbol = unit === "celsius" ? "°C" : "°F";
  console.log(`\n  ${city.name}${city.country ? `, ${city.country}` : ""}`);
  console.log(`  ${weatherDescription(current.weather_code)}`);
  console.log(`  Temperatura: ${current.temperature_2m}${symbol} (sensación ${current.apparent_temperature}${symbol})`);
  console.log(`  Humedad: ${current.relative_humidity_2m}%`);
  console.log(`  Viento: ${current.wind_speed_10m} km/h`);
}

function printMenu(data: AppData): void {
  console.clear();
  console.log("════════════════════════════════════════");
  console.log("             WEATHER CLI");
  console.log("════════════════════════════════════════");
  console.log(`  1. Clima de ciudad default${data.defaultCity ? ` (${data.defaultCity})` : ""}`);
  console.log(`  2. Clima de todas las ciudades (${data.cities.length})`);
  console.log("  3. Buscar y agregar ciudad");
  console.log("  4. Eliminar ciudad");
  console.log("  5. Establecer ciudad default");
  console.log(`  8. Ajustes (°${data.unit === "celsius" ? "C" : "F"})`);
  console.log("  9. Salir");
  console.log("════════════════════════════════════════");
}

function chooseCity(data: AppData, message: string): City | null {
  if (data.cities.length === 0) {
    console.log("\n  No hay ciudades guardadas.");
    return null;
  }

  while (true) {
    console.log(`\n${message}`);
    data.cities.forEach((city, index) => console.log(`  ${index + 1}. ${city.name}`));
    console.log("  0. Regresar");

    const answer = prompt("  Selecciona una ciudad: ")?.trim() ?? "";
    if (answer === "0") return null;

    const selected = Number(answer) - 1;
    if (Number.isInteger(selected) && selected >= 0 && selected < data.cities.length) {
      return data.cities[selected] ?? null;
    }

    console.log("  Selección no válida. Ingresa el número de una ciudad.");
  }
}

async function addCity(data: AppData): Promise<void> {
  const query = prompt("\n  Ingresa una ciudad: ")?.trim();
  if (!query) return;

  const city = await geocodeCity(query);
  if (!city) {
    console.log("  No se encontró esa ciudad.");
    return;
  }
  if (data.cities.some((savedCity) => savedCity.name.toLowerCase() === city.name.toLowerCase())) {
    console.log("  Esa ciudad ya está guardada.");
    return;
  }

  data.cities.push(city);
  if (!data.defaultCity) data.defaultCity = city.name;
  await saveData(data);
  console.log(`  ${city.name} fue agregada correctamente.`);
}

async function main(): Promise<void> {
  const data = await loadData();

  while (true) {
    printMenu(data);
    const option = prompt("  Selecciona una opción: ")?.trim();

    try {
      if (option === "1") {
        const city = data.cities.find((savedCity) => savedCity.name === data.defaultCity);
        if (!city) console.log("\n  Primero agrega una ciudad.");
        else await showWeather(city, data.unit);
      } else if (option === "2") {
        if (data.cities.length === 0) console.log("\n  Primero agrega una ciudad.");
        else for (const city of data.cities) await showWeather(city, data.unit);
      } else if (option === "3") {
        await addCity(data);
      } else if (option === "4") {
        const city = chooseCity(data, "  Ciudades guardadas:");
        if (city) {
          data.cities = data.cities.filter((savedCity) => savedCity.name !== city.name);
          if (data.defaultCity === city.name) data.defaultCity = data.cities[0]?.name ?? null;
          await saveData(data);
          console.log(`  ${city.name} fue eliminada.`);
        }
      } else if (option === "5") {
        const city = chooseCity(data, "  Elige la ciudad default:");
        if (city) {
          data.defaultCity = city.name;
          await saveData(data);
          console.log(`  ${city.name} es ahora tu ciudad default.`);
        }
      } else if (option === "8") {
        data.unit = data.unit === "celsius" ? "fahrenheit" : "celsius";
        await saveData(data);
        console.log(`\n  Unidad cambiada a °${data.unit === "celsius" ? "C" : "F"}.`);
      } else if (option === "9") {
        console.log("\n  Hasta luego.");
        break;
      } else {
        console.log("\n  Opción no válida.");
      }
    } catch (error) {
      console.log(`\n  Error: ${error instanceof Error ? error.message : "ocurrió un error inesperado."}`);
    }

    if (option !== "9") prompt("\n  Presiona Enter para continuar...");
  }
}

await main();
