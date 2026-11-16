import type { Unit } from "./City.ts";

export type WeatherResponse = {
  current?: {
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    wind_speed_10m: number;
    weather_code: number;
  };
};

export type ForecastResponse = {
  daily?: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    weather_code: number[];
  };
};

export type WeatherQuery = {
  latitude: number;
  longitude: number;
  unit: Unit;
};
