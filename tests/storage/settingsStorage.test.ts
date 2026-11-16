import { expect, test } from "bun:test";
import { mkdtemp, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { loadData } from "../../src/storage/fileStorage.ts";
import { setUnit } from "../../src/storage/settingsStorage.ts";

test("persiste el cambio de unidad", async () => {
  const directory = await mkdtemp(join(tmpdir(), "weather-settings-"));
  const filePath = join(directory, "weather.json");
  await setUnit("fahrenheit", filePath);
  expect((await loadData(filePath)).unit).toBe("fahrenheit");
  await rm(directory, { recursive: true, force: true });
});
