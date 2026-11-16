import type { City } from "../types/City.ts";

type GeocodingResult = {
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
};

export async function searchCities(query: string): Promise<City[]> {
  const params = new URLSearchParams({
    name: query,
    count: "5",
    language: "es",
    format: "json",
  });
  const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?${params}`);
  if (!response.ok) throw new Error("No se pudo consultar la ubicación.");

  const data = (await response.json()) as { results?: GeocodingResult[] };
  return (data.results ?? []).map((result) => ({
    name: result.name,
    latitude: result.latitude,
    longitude: result.longitude,
    country: result.country,
  }));
}
