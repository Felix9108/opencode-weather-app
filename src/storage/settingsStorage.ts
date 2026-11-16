import type { AppData, Unit } from "../types/City.ts";
import { loadData, saveData } from "./fileStorage.ts";

export async function saveSettings(settings: Pick<AppData, "defaultCity" | "unit">, filePath?: string): Promise<void> {
  const data = await loadData(filePath);
  await saveData({ ...data, ...settings }, filePath);
}

export async function setUnit(unit: Unit, filePath?: string): Promise<void> {
  const data = await loadData(filePath);
  await saveData({ ...data, unit }, filePath);
}
