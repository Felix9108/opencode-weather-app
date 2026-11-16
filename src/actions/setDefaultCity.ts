import type { AppData } from "../types/City.ts";
import { saveData } from "../storage/fileStorage.ts";

export async function setDefaultCity(data: AppData, cityName: string, filePath?: string): Promise<void> {
  if (!data.cities.some((city) => city.name === cityName)) throw new Error("La ciudad no está guardada.");
  data.defaultCity = cityName;
  await saveData(data, filePath);
}
