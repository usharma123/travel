export interface TravelPlan {
  day: number;
  activity: string;
}

export function generateTravelPlan(
  location: { lat: number; lon: number },
  budget: number
): TravelPlan[] {
  const city = `Lat ${location.lat.toFixed(2)}, Lon ${location.lon.toFixed(2)}`;
  const dailyBudget = budget / 5;
  return [
    { day: 1, activity: `Arrive in ${city}, check into a hotel (~$${dailyBudget.toFixed(0)})` },
    { day: 2, activity: 'City tour and local cuisine tasting' },
    { day: 3, activity: 'Outdoor adventure and sightseeing' },
    { day: 4, activity: 'Cultural experiences and museum visits' },
    { day: 5, activity: `Relax and shop for souvenirs within your $${dailyBudget.toFixed(0)} budget` }
  ];
}
