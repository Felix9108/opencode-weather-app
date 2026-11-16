import type { City, Unit } from "../types/City.ts";
import type { ForecastResponse, WeatherResponse } from "../types/Weather.ts";

export async function getCurrentWeather(city: City, unit: Unit): Promise<NonNullable<WeatherResponse["current"]>> {
  const params = new URLSearchParams({
    latitude: String(city.latitude),
    longitude: String(city.longitude),
    current: "temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,weather_code",
    temperature_unit: unit,
    wind_speed_unit: "kmh",
  });
  const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
  if (!response.ok) throw new Error("No se pudo consultar el clima.");

  const data = (await response.json()) as WeatherResponse;
  if (!data.current) throw new Error("La API no devolvió datos del clima.");
  return data.current;
}

export async function getForecast(city: City, unit: Unit): Promise<NonNullable<ForecastResponse["daily"]>> {
  const params = new URLSearchParams({
    latitude: String(city.latitude),
    longitude: String(city.longitude),
    daily: "temperature_2m_max,temperature_2m_min,weather_code",
    forecast_days: "7",
    temperature_unit: unit,
    timezone: "auto",
  });
  const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
  if (!response.ok) throw new Error("No se pudo consultar el pronóstico.");

  const data = (await response.json()) as ForecastResponse;
  if (!data.daily) throw new Error("La API no devolvió datos del pronóstico.");
  return data.daily;
}
