import type { AppData } from "../types/City.ts";
import { color } from "../utils/colors.ts";

export function printMenu(data: AppData): void {
  console.clear();
  console.log(color.cyan("════════════════════════════════════════"));
  console.log(color.cyan("             WEATHER CLI"));
  console.log(color.cyan("════════════════════════════════════════"));
  console.log(`  1. Clima de ciudad default${data.defaultCity ? ` (${data.defaultCity})` : ""}`);
  console.log(`  2. Clima de todas las ciudades (${data.cities.length})`);
  console.log("  3. Buscar y agregar ciudad");
  console.log("  4. Eliminar ciudad");
  console.log("  5. Establecer ciudad default");
  console.log("  6. Pronóstico de 7 días");
  console.log("  7. Pronóstico de todas las ciudades");
  console.log(`  8. Ajustes (°${data.unit === "celsius" ? "C" : "F"})`);
  console.log("  9. Salir");
  console.log(color.cyan("════════════════════════════════════════"));
}
