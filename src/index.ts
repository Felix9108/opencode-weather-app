import { addCity } from "./actions/addCity.ts";
import { getForecast } from "./actions/getForecast.ts";
import { getWeather } from "./actions/getWeather.ts";
import { removeCity } from "./actions/removeCity.ts";
import { setDefaultCity } from "./actions/setDefaultCity.ts";
import { searchCities } from "./api/geocoding.ts";
import { chooseCity, chooseSearchResult, ask } from "./presentation/input.ts";
import { printMenu } from "./presentation/menu.ts";
import { showForecast, showWeather, withLoading } from "./presentation/output.ts";
import { loadData } from "./storage/fileStorage.ts";
import { setUnit } from "./storage/settingsStorage.ts";
import type { AppData, City } from "./types/City.ts";

async function addCityFromInput(data: AppData): Promise<void> {
  const query = ask("\n  Ingresa una ciudad: ");
  if (!query) return;
  const results = await withLoading("Buscando ubicaciones...", () => searchCities(query));
  if (results.length === 0) {
    console.log("  No se encontró esa ciudad.");
    return;
  }

  console.log("\n  Resultados encontrados:");
  const city = chooseSearchResult(results);
  if (!city) return;
  await addCity(data, city);
  console.log(`  ${city.name} fue agregada correctamente.`);
}

function defaultCity(data: AppData): City | null {
  return data.cities.find((city) => city.name === data.defaultCity) ?? null;
}

export async function run(): Promise<void> {
  const data = await loadData();

  while (true) {
    printMenu(data);
    const option = ask("  Selecciona una opción: ");

    try {
      if (option === "1") {
        const city = defaultCity(data);
        if (!city) console.log("\n  Primero agrega una ciudad.");
        else await withLoading("Consultando clima...", async () => showWeather(city, await getWeather(city, data.unit), data.unit));
      } else if (option === "2") {
        if (data.cities.length === 0) console.log("\n  Primero agrega una ciudad.");
        else for (const city of data.cities) await withLoading(`Consultando ${city.name}...`, async () => showWeather(city, await getWeather(city, data.unit), data.unit));
      } else if (option === "3") {
        await addCityFromInput(data);
      } else if (option === "4") {
        const city = chooseCity(data, "  Ciudades guardadas:");
        if (city) {
          await removeCity(data, city.name);
          console.log(`  ${city.name} fue eliminada.`);
        }
      } else if (option === "5") {
        const city = chooseCity(data, "  Elige la ciudad default:");
        if (city) {
          await setDefaultCity(data, city.name);
          console.log(`  ${city.name} es ahora tu ciudad default.`);
        }
      } else if (option === "6") {
        const city = defaultCity(data);
        if (!city) console.log("\n  Primero agrega una ciudad.");
        else await withLoading("Consultando pronóstico...", async () => showForecast(city, await getForecast(city, data.unit), data.unit));
      } else if (option === "7") {
        if (data.cities.length === 0) console.log("\n  Primero agrega una ciudad.");
        else for (const city of data.cities) await withLoading(`Consultando pronóstico de ${city.name}...`, async () => showForecast(city, await getForecast(city, data.unit), data.unit));
      } else if (option === "8") {
        data.unit = data.unit === "celsius" ? "fahrenheit" : "celsius";
        await setUnit(data.unit);
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

    if (option !== "9") ask("\n  Presiona Enter para continuar...");
  }
}

if (import.meta.main) await run();
