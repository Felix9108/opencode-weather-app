import { getCurrentWeather } from "../api/weather.ts";
import type { City, Unit } from "../types/City.ts";

export function getWeather(city: City, unit: Unit) {
  return getCurrentWeather(city, unit);
}
