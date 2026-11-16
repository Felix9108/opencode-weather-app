import type { AppData, City } from "../types/City.ts";
import { saveData } from "../storage/fileStorage.ts";

export async function addCity(data: AppData, city: City): Promise<void> {
  if (data.cities.some((savedCity) => savedCity.name.toLowerCase() === city.name.toLowerCase())) {
    throw new Error("Esa ciudad ya está guardada.");
  }

  data.cities.push(city);
  if (!data.defaultCity) data.defaultCity = city.name;
  await saveData(data);
}
