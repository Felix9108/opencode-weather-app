import type { AppData, Unit } from "../types/City.ts";
import { loadData, saveData } from "./fileStorage.ts";

export async function saveSettings(settings: Pick<AppData, "defaultCity" | "unit">): Promise<void> {
  const data = await loadData();
  await saveData({ ...data, ...settings });
}

export async function setUnit(unit: Unit): Promise<void> {
  const data = await loadData();
  await saveData({ ...data, unit });
}
