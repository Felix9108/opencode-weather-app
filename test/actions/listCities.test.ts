import { expect, test } from "bun:test";
import { listCities } from "../../src/actions/listCities.ts";

test("lista las ciudades guardadas", () => {
  const cities = [{ name: "Ottawa", latitude: 45, longitude: -75 }];
  expect(listCities({ cities, defaultCity: "Ottawa", unit: "celsius" })).toBe(cities);
});
