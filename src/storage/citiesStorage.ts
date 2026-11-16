import type { City } from "../types/City.ts";
import { loadData, saveData } from "./fileStorage.ts";

export async function getCities(): Promise<City[]> {
  return (await loadData()).cities;
}

export async function saveCities(cities: City[]): Promise<void> {
  const data = await loadData();
  await saveData({ ...data, cities });
}
