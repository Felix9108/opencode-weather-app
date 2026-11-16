import { expect, test } from "bun:test";
import { formatForecastDate, temperatureSymbol, weatherDescription } from "../../src/utils/format.ts";

test("traduce códigos meteorológicos conocidos", () => {
  expect(weatherDescription(0)).toBe("Despejado");
  expect(weatherDescription(63)).toBe("Lluvia");
  expect(weatherDescription(95)).toBe("Tormenta");
  expect(weatherDescription(999)).toBe("Condición desconocida");
});

test("formatea unidades y fechas", () => {
  expect(temperatureSymbol("celsius")).toBe("°C");
  expect(temperatureSymbol("fahrenheit")).toBe("°F");
  expect(formatForecastDate("2026-01-15")).toContain("15");
});
