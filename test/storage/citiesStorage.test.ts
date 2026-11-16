import { expect, test } from "bun:test";
import { mkdtemp, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { getCities, saveCities } from "../../src/storage/citiesStorage.ts";

test("guarda y recupera ciudades con citiesStorage", async () => {
  const directory = await mkdtemp(join(tmpdir(), "weather-cities-"));
  const filePath = join(directory, "weather.json");
  const cities = [{ name: "Ottawa", latitude: 45, longitude: -75 }];

  await saveCities(cities, filePath);
  expect(await getCities(filePath)).toEqual(cities);
  await rm(directory, { recursive: true, force: true });
});
