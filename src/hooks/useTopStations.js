import { useMemo } from 'react';

/**
 * Deduplicate stations by name → sort by lowest opportunity cost → pick top10.
 */
export default function useTopStations(livingOpportunities) {
  return useMemo(() => {
    if (!livingOpportunities?.length) return [];
    const unique = new Map();
    livingOpportunities.forEach((s) => {
      if (!unique.has(s.stationName)) unique.set(s.stationName, s);
    });
    return [...unique.values()]
      .sort((a, b) => a.totalOpportunityCost - b.totalOpportunityCost)
      .slice(0, 10);
  }, [livingOpportunities]);
}
