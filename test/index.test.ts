import { expect, test } from "bun:test";
import type { AppData, City, Unit } from "../src/types/City.ts";
import type { MenuOption } from "../src/types/MenuOption.ts";

test("mantiene los contratos principales de la aplicación", () => {
  const city: City = { name: "Ottawa", latitude: 45, longitude: -75 };
  const unit: Unit = "celsius";
  const option: MenuOption = "9";
  const data: AppData = { cities: [city], defaultCity: city.name, unit };

  expect(data.defaultCity).toBe("Ottawa");
  expect(option).toBe("9");
});
