import { afterEach, expect, test } from "bun:test";
import { searchCities } from "../../src/api/geocoding.ts";

const originalFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = originalFetch;
});

test("devuelve múltiples ciudades desde geocoding", async () => {
  globalThis.fetch = (async () => new Response(JSON.stringify({
    results: [
      { name: "Springfield", latitude: 39.78, longitude: -89.64, country: "Estados Unidos" },
      { name: "Springfield", latitude: 42.1, longitude: -72.59, country: "Estados Unidos" },
    ],
  }))) as unknown as typeof fetch;

  const cities = await searchCities("Springfield");
  expect(cities).toHaveLength(2);
  expect(cities[1]?.longitude).toBe(-72.59);
});

test("lanza error si geocoding responde con error", async () => {
  globalThis.fetch = (async () => new Response(null, { status: 500 })) as unknown as typeof fetch;
  expect(searchCities("Unknown")).rejects.toThrow("No se pudo consultar la ubicación.");
});
