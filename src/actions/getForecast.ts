import { getForecast as fetchForecast } from "../api/weather.ts";
import type { City, Unit } from "../types/City.ts";

export function getForecast(city: City, unit: Unit) {
  return fetchForecast(city, unit);
}
