import { afterEach, expect, test } from "bun:test";
import { getCurrentWeather, getForecast } from "../../src/api/weather.ts";

const originalFetch = globalThis.fetch;
const city = { name: "Ottawa", latitude: 45.41, longitude: -75.69 };

afterEach(() => {
  globalThis.fetch = originalFetch;
});

test("obtiene el clima actual", async () => {
  globalThis.fetch = (async () => new Response(JSON.stringify({
    current: {
      temperature_2m: 12,
      relative_humidity_2m: 70,
      apparent_temperature: 11,
      wind_speed_10m: 8,
      weather_code: 1,
    },
  }))) as unknown as typeof fetch;

  const current = await getCurrentWeather(city, "celsius");
  expect(current.temperature_2m).toBe(12);
  expect(current.weather_code).toBe(1);
});

test("obtiene el pronóstico de siete días", async () => {
  globalThis.fetch = (async () => new Response(JSON.stringify({
    daily: {
      time: ["2026-01-01", "2026-01-02"],
      temperature_2m_max: [10, 12],
      temperature_2m_min: [2, 4],
      weather_code: [0, 63],
    },
  }))) as unknown as typeof fetch;

  const forecast = await getForecast(city, "celsius");
  expect(forecast.time).toHaveLength(2);
  expect(forecast.temperature_2m_max[1]).toBe(12);
});

test("lanza error para respuestas meteorológicas inválidas", async () => {
  globalThis.fetch = (async () => new Response(null, { status: 503 })) as unknown as typeof fetch;
  expect(getCurrentWeather(city, "celsius")).rejects.toThrow("No se pudo consultar el clima.");
});
