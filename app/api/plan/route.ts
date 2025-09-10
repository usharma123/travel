import { NextRequest, NextResponse } from "next/server";

interface RequestBody {
  lat: number;
  lng: number;
  budget: number;
}

export async function POST(req: NextRequest) {
  const { lat, lng, budget } = (await req.json()) as RequestBody;

  const geoRes = await fetch(
    `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
  );
  const geo = await geoRes.json();
  const country = geo.countryName;

  const infoRes = await fetch(
    `https://restcountries.com/v3.1/name/${encodeURIComponent(country)}?fields=capital`
  );
  const info = await infoRes.json();
  const capital = info[0]?.capital?.[0] || "the capital";

  const days = budget > 2000
    ? [
        `Arrive in ${capital} and enjoy premium accommodation.`,
        `Explore famous sites around ${capital} with a private guide.`,
        `Take a day trip to a nearby attraction.`,
        `Relax at a top-rated restaurant.`,
        `Finish with a cultural experience unique to ${country}.`,
      ]
    : [
        `Fly into ${capital} and check into a budget-friendly stay.`,
        `Visit free museums and walking tours in ${capital}.`,
        `Sample local street food and markets.`,
      ];

  return NextResponse.json({ country, days });
}
