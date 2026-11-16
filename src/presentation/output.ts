import type { City, Unit } from "../types/City.ts";
import type { ForecastResponse } from "../types/Weather.ts";
import { color } from "../utils/colors.ts";
import { formatForecastDate, temperatureSymbol, weatherDescription } from "../utils/format.ts";

export function showWeather(city: City, current: NonNullable<import("../types/Weather.ts").WeatherResponse["current"]>, unit: Unit): void {
  console.log(`\n  ${color.cyan(`${city.name}${city.country ? `, ${city.country}` : ""}`)}`);
  console.log(`  ${weatherDescription(current.weather_code)}`);
  console.log(`  Temperatura: ${color.yellow(`${current.temperature_2m}${temperatureSymbol(unit)}`)} (sensación ${current.apparent_temperature}${temperatureSymbol(unit)})`);
  console.log(`  Humedad: ${current.relative_humidity_2m}%`);
  console.log(`  Viento: ${current.wind_speed_10m} km/h`);
}

export function showForecast(city: City, daily: NonNullable<ForecastResponse["daily"]>, unit: Unit): void {
  console.log(`\n  ${color.cyan(`Pronóstico de ${city.name}`)}`);
  daily.time.forEach((date, index) => {
    const max = daily.temperature_2m_max[index];
    const min = daily.temperature_2m_min[index];
    const code = daily.weather_code[index];
    if (max === undefined || min === undefined || code === undefined) return;
    console.log(`  ${formatForecastDate(date)}: ${weatherDescription(code)} | ${color.yellow(`${max}${temperatureSymbol(unit)}`)} / ${min}${temperatureSymbol(unit)}`);
  });
}

export async function withLoading<T>(message: string, task: () => Promise<T>): Promise<T> {
  process.stdout.write(color.muted(`  ${message}`));
  try {
    const result = await task();
    console.log(color.green(" listo"));
    return result;
  } catch (error) {
    console.log(color.red(" error"));
    throw error;
  }
}
