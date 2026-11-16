export type Unit = "celsius" | "fahrenheit";

export type City = {
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
};

export type AppData = {
  cities: City[];
  defaultCity: string | null;
  unit: Unit;
};
