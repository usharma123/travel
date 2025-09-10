'use client';

import { useState } from 'react';
import Globe from '@/components/Globe';
import { generateTravelPlan, TravelPlan } from '@/lib/travel';

export default function Page() {
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [budget, setBudget] = useState(1500);
  const [plan, setPlan] = useState<TravelPlan[] | null>(null);

  const handleSelect = (c: { lat: number; lon: number }) => {
    setCoords(c);
    setPlan(null);
  };

  const handleGenerate = () => {
    if (coords) {
      setPlan(generateTravelPlan(coords, budget));
    }
  };

  return (
    <main style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div style={{ flex: 1, position: 'relative' }}>
        <Globe onSelect={handleSelect} />
        <div
          style={{
            position: 'absolute',
            top: 20,
            left: 20,
            background: 'rgba(0,0,0,0.5)',
            padding: '1rem',
            borderRadius: '8px'
          }}
        >
          <div>
            <label>
              Budget: $
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(parseInt(e.target.value, 10))}
                style={{ width: '6rem', marginLeft: '0.5rem' }}
              />
            </label>
          </div>
          {coords && (
            <div>
              Selected: {coords.lat.toFixed(2)}, {coords.lon.toFixed(2)}
            </div>
          )}
          <button
            onClick={handleGenerate}
            style={{
              marginTop: '0.5rem',
              padding: '0.5rem 1rem',
              background: '#ff5722',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              color: '#fff'
            }}
          >
            Generate Plan
          </button>
        </div>
      </div>
      {plan && (
        <div
          style={{
            maxHeight: '40vh',
            overflowY: 'auto',
            padding: '1rem',
            background: 'rgba(0,0,0,0.6)'
          }}
        >
          <h2>Travel Plan</h2>
          <ul>
            {plan.map((item) => (
              <li key={item.day}>
                Day {item.day}: {item.activity}
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}
