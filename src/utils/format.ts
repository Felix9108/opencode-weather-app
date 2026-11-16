import type { Unit } from "../types/City.ts";

export function temperatureSymbol(unit: Unit): string {
  return unit === "celsius" ? "°C" : "°F";
}

export function formatForecastDate(date: string): string {
  return new Intl.DateTimeFormat("es", {
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(new Date(`${date}T12:00:00`));
}

export function weatherDescription(code: number): string {
  if (code === 0) return "Despejado";
  if ([1, 2, 3].includes(code)) return "Parcialmente nublado";
  if ([45, 48].includes(code)) return "Niebla";
  if ([51, 53, 55, 56, 57].includes(code)) return "Llovizna";
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return "Lluvia";
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "Nieve";
  if ([95, 96, 99].includes(code)) return "Tormenta";
  return "Condición desconocida";
}
