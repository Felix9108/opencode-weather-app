import { afterEach, expect, test } from "bun:test";
import { mkdtemp, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { addCity } from "../../src/actions/addCity.ts";
import { removeCity } from "../../src/actions/removeCity.ts";
import { setDefaultCity } from "../../src/actions/setDefaultCity.ts";
import { loadData } from "../../src/storage/fileStorage.ts";
import type { AppData } from "../../src/types/City.ts";

const directories: string[] = [];
const city = { name: "Ottawa", latitude: 45, longitude: -75, country: "Canada" };

afterEach(async () => {
  await Promise.all(directories.splice(0).map((directory) => rm(directory, { recursive: true, force: true })));
});

test("agrega, establece default y elimina una ciudad", async () => {
  const directory = await mkdtemp(join(tmpdir(), "weather-actions-"));
  directories.push(directory);
  const filePath = join(directory, "weather.json");
  const data: AppData = { cities: [], defaultCity: null, unit: "celsius" };

  await addCity(data, city, filePath);
  expect(data.defaultCity).toBe("Ottawa");
  await setDefaultCity(data, "Ottawa", filePath);
  await removeCity(data, "Ottawa", filePath);
  expect(data.cities).toHaveLength(0);
  expect((await loadData(filePath)).defaultCity).toBeNull();
});

test("rechaza ciudades duplicadas y defaults inexistentes", async () => {
  const directory = await mkdtemp(join(tmpdir(), "weather-actions-"));
  directories.push(directory);
  const filePath = join(directory, "weather.json");
  const data: AppData = { cities: [city], defaultCity: "Ottawa", unit: "celsius" };

  expect(addCity(data, city, filePath)).rejects.toThrow("Esa ciudad ya está guardada.");
  expect(setDefaultCity(data, "Toronto", filePath)).rejects.toThrow("La ciudad no está guardada.");
});
