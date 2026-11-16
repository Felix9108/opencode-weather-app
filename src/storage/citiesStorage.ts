import type { City } from "../types/City.ts";
import { loadData, saveData } from "./fileStorage.ts";

export async function getCities(filePath?: string): Promise<City[]> {
  return (await loadData(filePath)).cities;
}

export async function saveCities(cities: City[], filePath?: string): Promise<void> {
  const data = await loadData(filePath);
  await saveData({ ...data, cities }, filePath);
}
