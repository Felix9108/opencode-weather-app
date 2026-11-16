import { homedir } from "node:os";
import { join } from "node:path";

export const configDirectory = process.env.XDG_CONFIG_HOME ?? join(homedir(), ".config");
export const storageFile = join(configDirectory, "weather-cli", "weather.json");

export const defaultData = {
  cities: [],
  defaultCity: null,
  unit: "celsius",
} as const;
