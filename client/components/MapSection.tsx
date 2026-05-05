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
import { socket } from "@/lib/socket";

import { useMemo, useState, useEffect } from "react";

const maharashtraCenter: [number, number] = [19.7515, 75.7139];
const boundsArray: [number, number][] = clusters.map((c) => [c.lat, c.lng]);

export function MapSection() {
  const markers = useMemo(() => clusters, []);
  const [zoom, setZoom] = useState<number>(7);

  const [reports, setReports] = useState<any[]>([]);

  // 🆕 CLICK REPORT STATES
  const [newLocation, setNewLocation] = useState<any>(null);
  const [issueText, setIssueText] = useState("");

  const [profile, setProfile] = useState({
    disability: "wheelchair",
  });

  function ZoomWatcher() {
    useMapEvents({
      zoomend: (e) => setZoom(e.target.getZoom()),
    });
    return null;
  }

  // 🆕 CLICK HANDLER
  function ClickHandler({ onAdd }: any) {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        onAdd(lat, lng);
      },
    });
    return null;
  }

  const handleMapClick = (lat: number, lng: number) => {
    setNewLocation({ lat, lng });
  };
  useEffect(() => {
    fetch("/api/report")
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched reports:", data); // debug
        setReports(data);
      })
      .catch((err) => console.error(err));
  }, []);
  // 🔥 SOCKET
  useEffect(() => {
    socket.on("new-report", (data) => {
      setReports((prev) => [...prev, data]);
    });

    socket.on("vote-update", (updated) => {
      setReports((prev) =>
        prev.map((r) => (r._id === updated._id ? updated : r))
      );
    });

    return () => {
      socket.off("new-report");
      socket.off("vote-update");
    };

  }, []);

  // 🧠 COLOR
  const getColor = (severity: string) => {
    if (severity === "HIGH") return "#ef4444";
    if (severity === "MEDIUM") return "#f59e0b";
    return "#22c55e";
  };

  // 👍 VOTE
  const handleVote = async (id: number) => {
   await fetch(`/api/report/${id}/vote`, {
  method: "PUT",
});
  };

  // 🆕 SUBMIT REPORT
  const submitReport = async () => {
    if (!issueText) return alert("Enter issue");

    const res = await fetch("/api/report", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        issue: issueText,
        location: newLocation,
      }),
    });

    const data = await res.json();

    // 🔥 ADD THIS (instant marker update)
    // setReports((prev) => [...prev, data]);

    setIssueText("");
    setNewLocation(null);
  };

  // 🧠 FILTER
// 🧠 FILTER (FIXED)
const filteredReports = useMemo(() => {
  if (profile.disability === "wheelchair") {
    return reports; // allow LOW also
  }

  if (profile.disability === "visual") {
    return reports.filter(
      (r) =>
        !r.issue?.toLowerCase().includes("no audio") &&
        !r.issue?.toLowerCase().includes("no guidance")
    );
  }

  return reports;
}, [reports, profile]);

  return (<div>
    {/* 🎛️ DROPDOWN */}
    <div style={{ marginBottom: "10px" }}> <label className="text-sm font-medium mr-2">
      Accessibility Mode: </label>

      <select
        value={profile.disability}
        onChange={(e) =>
          setProfile({ disability: e.target.value })
        }
        className="border px-2 py-1 rounded"
      >
        <option value="wheelchair">Wheelchair</option>
        <option value="visual">Visual</option>
        <option value="default">Default</option>
      </select>
    </div>

    {/* 🗺️ MAP */}
    <div
      style={{
        width: "100%",
        height: "520px",
        borderRadius: "12px",
        overflow: "hidden",
        border: "1px solid #ccc",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      <MapContainer
        key={profile.disability}
        center={maharashtraCenter}
        bounds={boundsArray as unknown as any}
        minZoom={3}
        maxZoom={19}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
        scrollWheelZoom
      >
        <ZoomWatcher />
        <ZoomControl position="topright" />

        {/* 🔥 CLICK ENABLED */}
        <ClickHandler onAdd={handleMapClick} />

        {/* 🌍 LAYERS */}
        <LayersControl position="topright">
          <LayersControl.BaseLayer name="OSM Standard">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          </LayersControl.BaseLayer>

          <LayersControl.BaseLayer checked name="Esri Streets">
            <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}" />
          </LayersControl.BaseLayer>
        </LayersControl>

        {/* 🔴 STATIC */}
        {markers.map((c) => (
          <CircleMarker
            key={c.id}
            center={[c.lat, c.lng]}
            radius={8}
            pathOptions={{ color: "#ef4444", fillColor: "#ef4444" }}
          >
            <Tooltip permanent={zoom >= 6}>
              <span className="text-xs">{c.name}</span>
            </Tooltip>

            <Popup>
              <div className="space-y-1">
                <p className="text-sm font-semibold">{c.name}</p>
                <p className="text-xs text-gray-500">{c.district}</p>
                <p className="text-xs">Type: {c.type}</p>
                <p className="text-xs">Capacity: {c.capacity}</p>
              </div>
            </Popup>
          </CircleMarker>
        ))}

        {/* ⚡ REAL-TIME */}
        {filteredReports
          .filter((r) => r.location && r.location.lat && r.location.lng) // ✅ prevent crash
          .map((r) => (
            <CircleMarker
              key={r._id}
              center={[r.location.lat, r.location.lng]}
              radius={10}
              pathOptions={{
                color: getColor(r.severity),
                fillColor: getColor(r.severity),
              }}
            >
              <Popup>
                <div className="space-y-1">
                  <p className="text-sm font-semibold">
                    <b>Issue:</b> {r.issue}
                  </p>

                  <p
                    className="text-xs font-semibold"
                    style={{ color: getColor(r.severity) }}
                  >
                    Severity: {r.severity}
                  </p>

                  <p className="text-xs">👍 Votes: {r.votes}</p>

                  <button
                    onClick={() => handleVote(r._id)}
                    className="bg-blue-500 text-white px-2 py-1 rounded text-xs"
                  >
                    Vote
                  </button>
                </div>
              </Popup>
            </CircleMarker>
          ))}

        {/* 🆕 CLICK FORM */}
        {newLocation && (
          <CircleMarker
            center={[newLocation.lat, newLocation.lng]}
            radius={12}
            pathOptions={{ color: "blue", fillColor: "blue" }}
          >
            <Popup>
              <div className="space-y-2">
                <p className="text-sm font-semibold">Add Issue</p>

                <input
                  type="text"
                  placeholder="Describe issue..."
                  value={issueText}
                  onChange={(e) =>
                    setIssueText(e.target.value)
                  }
                  className="border px-2 py-1 text-xs w-full"
                />

                <button
                  onClick={submitReport}
                  className="bg-green-500 text-white px-2 py-1 rounded text-xs"
                >
                  Submit
                </button>
              </div>
            </Popup>
          </CircleMarker>
        )}
      </MapContainer>
    </div>
  </div>

  );
}

export default MapSection;
