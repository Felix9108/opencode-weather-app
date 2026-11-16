import { mkdir } from "node:fs/promises";
import { dirname } from "node:path";
import type { AppData } from "../types/City.ts";
import { defaultData, storageFile } from "../utils/constants.ts";

export async function loadData(): Promise<AppData> {
  const file = Bun.file(storageFile);
  if (!(await file.exists())) return { ...defaultData, cities: [] };

  try {
    const stored = JSON.parse(await file.text()) as Partial<AppData>;
    return {
      cities: Array.isArray(stored.cities) ? stored.cities : [],
      defaultCity: stored.defaultCity ?? null,
      unit: stored.unit === "fahrenheit" ? "fahrenheit" : "celsius",
    };
  } catch {
    return { ...defaultData, cities: [] };
  }
}

export async function saveData(data: AppData): Promise<void> {
  await mkdir(dirname(storageFile), { recursive: true });
  await Bun.write(storageFile, JSON.stringify(data, null, 2));
}
