import { expect, test } from "bun:test";
import { searchCities } from "./src/api/geocoding.ts";
import { weatherDescription } from "./src/utils/format.ts";

test("traduce códigos meteorológicos", () => {
  expect(weatherDescription(0)).toBe("Despejado");
  expect(weatherDescription(63)).toBe("Lluvia");
  expect(weatherDescription(95)).toBe("Tormenta");
});

test("mapea múltiples resultados de geocodificación", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = (async () =>
    new Response(JSON.stringify({
      results: [
        { name: "Springfield", latitude: 39.78, longitude: -89.64, country: "Estados Unidos" },
        { name: "Springfield", latitude: 42.1, longitude: -72.59, country: "Estados Unidos" },
      ],
    }))) as unknown as typeof fetch;

  try {
    const cities = await searchCities("Springfield");
    expect(cities).toHaveLength(2);
    expect(cities[1]?.longitude).toBe(-72.59);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
