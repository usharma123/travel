"use client";

import { useState } from "react";
import Globe from "@/components/Globe";

interface Plan { days: string[] }

export default function Home() {
  const [budget, setBudget] = useState("");
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSelect = (lat: number, lng: number) => {
    setLocation({ lat, lng });
  };

  const generatePlan = async () => {
    if (!location) return;
    setLoading(true);
    try {
      const res = await fetch("/api/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...location, budget: Number(budget) }),
      });
      const data = await res.json();
      setPlan(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center gap-4 p-4">
      <h1 className="text-3xl font-bold">Dart Travel</h1>
      <Globe onSelect={handleSelect} />
      <input
        type="number"
        placeholder="Budget in USD"
        value={budget}
        onChange={(e) => setBudget(e.target.value)}
        className="border rounded p-2"
      />
      <button
        onClick={generatePlan}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        disabled={!budget || !location || loading}
      >
        {loading ? "Planning..." : "Generate Plan"}
      </button>
      {plan && (
        <div className="mt-4 w-full max-w-md bg-white/70 p-4 rounded shadow">
          <h2 className="font-semibold mb-2">Suggested itinerary</h2>
          <ul className="list-disc pl-5">
            {plan.days.map((d, i) => (
              <li key={i}>{d}</li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}
