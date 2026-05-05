export type ClusterType =
  | "Community Center"
  | "Rehab Facility"
  | "Education Support"
  | "Healthcare Center"
  | "Shelter"
  | "Skill Training";

export interface DisabilityCluster {
  id: string;
  name: string;
  district: string;
  lat: number;
  lng: number;
  type: ClusterType;
  capacity: number;
  description: string;
}

// Base locations across Maharashtra with desired cluster counts
const baseLocations: Array<{
  city: string;
  district: string;
  lat: number;
  lng: number;
  count: number;
}> = [
  { city: "Mumbai", district: "Mumbai", lat: 19.076, lng: 72.8777, count: 4 },
  { city: "Thane", district: "Thane", lat: 19.2183, lng: 72.9781, count: 2 },
  { city: "Pune", district: "Pune", lat: 18.5204, lng: 73.8567, count: 4 },
  { city: "Nagpur", district: "Nagpur", lat: 21.1458, lng: 79.0882, count: 3 },
  { city: "Nashik", district: "Nashik", lat: 19.9975, lng: 73.7898, count: 2 },
  { city: "Aurangabad", district: "Aurangabad", lat: 19.8762, lng: 75.3433, count: 2 },
  { city: "Solapur", district: "Solapur", lat: 17.6599, lng: 75.9064, count: 2 },
  { city: "Kolhapur", district: "Kolhapur", lat: 16.705, lng: 74.2433, count: 2 },
  { city: "Satara", district: "Satara", lat: 17.6805, lng: 73.9935, count: 1 },
  { city: "Sangli", district: "Sangli", lat: 16.8524, lng: 74.5815, count: 1 },
  { city: "Jalgaon", district: "Jalgaon", lat: 21.0077, lng: 75.5626, count: 1 },
  { city: "Nanded", district: "Nanded", lat: 19.1383, lng: 77.321, count: 1 },
  { city: "Amravati", district: "Amravati", lat: 20.9374, lng: 77.7796, count: 1 },
  { city: "Akola", district: "Akola", lat: 20.7002, lng: 77.0082, count: 1 },
  { city: "Ahmednagar", district: "Ahmednagar", lat: 19.0948, lng: 74.7384, count: 2 },
  { city: "Latur", district: "Latur", lat: 18.4088, lng: 76.5604, count: 1 },
  { city: "Beed", district: "Beed", lat: 18.9891, lng: 75.7601, count: 1 },
  { city: "Parbhani", district: "Parbhani", lat: 19.27, lng: 76.76, count: 1 },
  { city: "Osmanabad", district: "Osmanabad", lat: 18.1861, lng: 76.0419, count: 1 },
  { city: "Wardha", district: "Wardha", lat: 20.7453, lng: 78.6022, count: 1 },
  { city: "Chandrapur", district: "Chandrapur", lat: 19.9615, lng: 79.2961, count: 1 },
  { city: "Yavatmal", district: "Yavatmal", lat: 20.3866, lng: 78.1204, count: 1 },
  { city: "Buldhana", district: "Buldhana", lat: 20.5298, lng: 76.1842, count: 1 },
  { city: "Ratnagiri", district: "Ratnagiri", lat: 16.991, lng: 73.31, count: 1 },
  { city: "Sindhudurg", district: "Sindhudurg", lat: 16.1, lng: 73.7, count: 1 },
  { city: "Raigad", district: "Raigad", lat: 18.6414, lng: 72.8722, count: 2 },
  { city: "Palghar", district: "Palghar", lat: 19.696, lng: 72.7655, count: 1 },
  { city: "Gondia", district: "Gondia", lat: 21.4624, lng: 80.2209, count: 1 },
  { city: "Gadchiroli", district: "Gadchiroli", lat: 20.188, lng: 80.0, count: 1 },
  { city: "Dhule", district: "Dhule", lat: 20.9042, lng: 74.7749, count: 1 },
  { city: "Nandurbar", district: "Nandurbar", lat: 21.374, lng: 74.2405, count: 1 },
  { city: "Hingoli", district: "Hingoli", lat: 19.719, lng: 77.1457, count: 1 },
  { city: "Jalna", district: "Jalna", lat: 19.841, lng: 75.889, count: 1 },
  { city: "Washim", district: "Washim", lat: 20.1113, lng: 77.133, count: 1 },
  // Extra clusters to reach 50
  { city: "Navi Mumbai", district: "Thane", lat: 19.033, lng: 73.0297, count: 2 },
  { city: "Kalyan", district: "Thane", lat: 19.2403, lng: 73.1305, count: 1 },
  { city: "Panvel", district: "Raigad", lat: 18.9894, lng: 73.1175, count: 1 },
  { city: "Kharghar", district: "Raigad", lat: 19.045, lng: 73.069, count: 1 },
];

const types: ClusterType[] = [
  "Community Center",
  "Rehab Facility",
  "Education Support",
  "Healthcare Center",
  "Shelter",
  "Skill Training",
];

function round6(n: number) {
  return Math.round(n * 1_000_000) / 1_000_000;
}

export const clusters: DisabilityCluster[] = (() => {
  const result: DisabilityCluster[] = [];
  let idCounter = 1;
  for (const base of baseLocations) {
    for (let i = 0; i < base.count; i++) {
      const delta = 0.02 * (i % 3) + 0.005 * Math.floor(i / 3);
      const lat = round6(base.lat + delta);
      const lng = round6(base.lng + delta);
      const type = types[(idCounter - 1) % types.length];
      const capacity = 50 + ((idCounter * 13) % 200);
      result.push({
        id: `CL-${idCounter.toString().padStart(3, "0")}`,
        name: `Helping Hands ${base.city} Cluster ${i + 1}`,
        district: base.district,
        lat,
        lng,
        type,
        capacity,
        description: `${type} serving local disability community in ${base.city}.` ,
      });
      idCounter++;
    }
  }
  // Ensure exactly 50 entries (trim if over)
  return result.slice(0, 50);
})();

export type { DisabilityCluster as Cluster };
