import type { AppData } from "../types/City.ts";
import { saveData } from "../storage/fileStorage.ts";

export async function removeCity(data: AppData, cityName: string, filePath?: string): Promise<void> {
  data.cities = data.cities.filter((city) => city.name !== cityName);
  if (data.defaultCity === cityName) data.defaultCity = data.cities[0]?.name ?? null;
  await saveData(data, filePath);
}
