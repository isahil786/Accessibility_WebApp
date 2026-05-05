import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  ZoomControl,
  Tooltip,
  useMapEvents,
  LayersControl,
} from "react-leaflet";

import "@/styles/leaflet.css";
import "@/styles/leaflet-overrides.css";

import { clusters } from "@/data/clusters";
import { useMemo, useState } from "react";

interface Grouped {
  district: string;
  lat: number;
  lng: number;
  count: number;
  names: string[];
}

const maharashtraCenter: [number, number] = [19.7515, 75.7139];

export default function MapCitySection() {
  const groups = useMemo<Grouped[]>(() => {
    const by: Record<
      string,
      { lat: number; lng: number; count: number; names: string[] }
    > = {};

    for (const c of clusters) {
      const key = c.district;

      if (!by[key]) {
        by[key] = { lat: 0, lng: 0, count: 0, names: [] };
      }

      by[key].lat += c.lat;
      by[key].lng += c.lng;
      by[key].count += 1;

      if (by[key].names.length < 5) {
        by[key].names.push(c.name);
      }
    }

    return Object.entries(by).map(([district, v]) => ({
      district,
      lat: v.lat / v.count,
      lng: v.lng / v.count,
      count: v.count,
      names: v.names,
    }));
  }, []);

  const [zoom, setZoom] = useState<number>(6);

  function ZoomWatcher() {
    useMapEvents({
      zoomend: (e) => setZoom(e.target.getZoom()),
    });
    return null;
  }

  return (
    <div className="w-full h-[520px] rounded-xl overflow-hidden border shadow-sm">
      <MapContainer
        center={maharashtraCenter}
        zoom={6}
        minZoom={3}
        maxZoom={19}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
        scrollWheelZoom
      >
        <ZoomWatcher />
        <ZoomControl position="topright" />

        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="OSM Standard">
            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              detectRetina
            />
          </LayersControl.BaseLayer>

          <LayersControl.BaseLayer name="Esri Streets">
            <TileLayer
              attribution="Tiles © Esri — Source: Esri, HERE, Garmin, © OpenStreetMap contributors, and the GIS User Community"
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
            />
          </LayersControl.BaseLayer>

          <LayersControl.BaseLayer name="CARTO Voyager">
            <TileLayer
              attribution="&copy; OpenStreetMap contributors &copy; CARTO"
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            />
          </LayersControl.BaseLayer>
        </LayersControl>

        {groups.map((g) => (
          <CircleMarker
            key={g.district}
            center={[g.lat, g.lng]}
            radius={9}
            pathOptions={{
              color: "#ef4444",
              fillColor: "#ef4444",
              fillOpacity: 0.85,
            }}
          >
            <Tooltip
              permanent={zoom >= 6}
              direction="right"
              offset={[8, 0]}
              opacity={0.95}
              className="!bg-white !text-black !border !border-gray-300 !rounded-md !px-2 !py-1 !shadow"
            >
              <span className="text-xs font-medium">
                {g.district} ({g.count})
              </span>
            </Tooltip>

            <Popup>
              <div className="space-y-1">
                <p className="text-sm font-semibold">
                  {g.district} • {g.count} clusters
                </p>
                <ul className="text-xs list-disc pl-4">
                  {g.names.map((n) => (
                    <li key={n}>{n}</li>
                  ))}
                </ul>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}