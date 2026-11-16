import type { City, AppData } from "../types/City.ts";

export function ask(message: string): string {
  return prompt(message)?.trim() ?? "";
}

export function chooseCity(data: AppData, message: string): City | null {
  if (data.cities.length === 0) {
    console.log("\n  No hay ciudades guardadas.");
    return null;
  }

  while (true) {
    console.log(`\n${message}`);
    data.cities.forEach((city, index) => console.log(`  ${index + 1}. ${city.name}`));
    console.log("  0. Regresar");

    const answer = ask("  Selecciona una ciudad: ");
    if (answer === "0") return null;

    const selected = Number(answer) - 1;
    if (Number.isInteger(selected) && selected >= 0 && selected < data.cities.length) {
      return data.cities[selected] ?? null;
    }
    console.log("  Selección no válida. Ingresa el número de una ciudad.");
  }
}

export function chooseSearchResult(cities: City[]): City | null {
  cities.forEach((city, index) => console.log(`  ${index + 1}. ${city.name}${city.country ? `, ${city.country}` : ""}`));
  const selected = Number(ask("  Selecciona una ubicación (0 para cancelar): ")) - 1;
  return selected < 0 ? null : cities[selected] ?? null;
}
