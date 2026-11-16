import { afterEach, expect, test } from "bun:test";
import { mkdtemp, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { loadData, saveData } from "../../src/storage/fileStorage.ts";

const temporaryDirectories: string[] = [];

afterEach(async () => {
  await Promise.all(temporaryDirectories.splice(0).map((directory) => rm(directory, { recursive: true, force: true })));
});

test("guarda y carga datos sin tocar el archivo real", async () => {
  const directory = await mkdtemp(join(tmpdir(), "weather-test-"));
  temporaryDirectories.push(directory);
  const filePath = join(directory, "weather.json");
  const data = { cities: [{ name: "Ottawa", latitude: 45, longitude: -75 }], defaultCity: "Ottawa", unit: "celsius" as const };

  await saveData(data, filePath);
  expect(await loadData(filePath)).toEqual(data);
});

test("devuelve datos iniciales para un archivo inexistente", async () => {
  const directory = await mkdtemp(join(tmpdir(), "weather-test-"));
  temporaryDirectories.push(directory);
  const data = await loadData(join(directory, "missing.json"));
  expect(data).toEqual({ cities: [], defaultCity: null, unit: "celsius" });
});
