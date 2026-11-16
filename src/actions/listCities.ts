import type { AppData, City } from "../types/City.ts";

export function listCities(data: AppData): City[] {
  return data.cities;
}
