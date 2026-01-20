import React, { useRef, useEffect, useCallback, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import type { Report, ReportType } from "../types";
import { getReports } from "../services/reportService";

const typeColorMap: Record<ReportType, string> = {
  infrastructure: "#FFD300",
  safety: "#FF3131",
  environment: "#3CB043",
  other: "#8e8e8e"
};

const MapSection: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const userMarkerRef = useRef<mapboxgl.Marker | null>(null);

  // Poprawna kolejność [lng, lat] dla Mapbox
  const defaultCoords: [number, number] = [19.906864041831486, 50.03011538986579];

  const [reports, setReports] = useState<Report[]>([]);
  const [userPosition, setUserPosition] = useState<[number, number]>(defaultCoords);
  const [radius, setRadius] = useState<number>(500);
  const [mapCentered, setMapCentered] = useState(false);

  // Pobieranie raportów
  const fetchReports = useCallback(async () => {
    try {
      const data = await getReports();
      setReports(data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  // Inicjalizacja mapy i domyślnego markera
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: defaultCoords,
      zoom: 10
    });

    // Fioletowy marker dla domyślnej pozycji
    const marker = new mapboxgl.Marker({ color: "purple" })
      .setLngLat(defaultCoords)
      .setPopup(new mapboxgl.Popup().setText("You are here"))
      .addTo(mapRef.current);

    userMarkerRef.current = marker;

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  // Polling raportów
  useEffect(() => {
    fetchReports();
    const interval = setInterval(fetchReports, 3000);
    return () => clearInterval(interval);
  }, [fetchReports]);

  // Geolokalizacja użytkownika
  useEffect(() => {
    if (!navigator.geolocation) return;

    const watch = navigator.geolocation.watchPosition(
      (pos) => {
        const newPos: [number, number] = [pos.coords.longitude, pos.coords.latitude]; // <-- poprawione
        setUserPosition(newPos);

        if (mapRef.current && userMarkerRef.current) {
          userMarkerRef.current.setLngLat(newPos);
          if (!mapCentered) {
            mapRef.current.flyTo({ center: newPos, zoom: 14 });
            setMapCentered(true);
          }
        }
      },
      (err) => console.warn("No location:", err),
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(watch);
  }, [mapCentered]);

  // Funkcja licząca odległość w metrach
  const getDistance = (lng1: number, lat1: number, lng2: number, lat2: number) => {
    const R = 6371000;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Rysowanie markerów raportów
  useEffect(() => {
    if (!mapRef.current) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    reports
      .filter((r) => r.latitude && r.longitude)
      .filter((r) => {
        const distance = getDistance(
          userPosition[0], userPosition[1], // lng, lat
          r.longitude!, r.latitude!
        );
        return distance <= radius;
      })
      .forEach((r) => {
        const popup = new mapboxgl.Popup({ closeButton: false, closeOnClick: false }).setHTML(
          `<strong>${r.title}</strong><br/>${r.description ?? ""}`
        );

        const marker = new mapboxgl.Marker({ color: typeColorMap[r.type] })
          .setLngLat([r.longitude!, r.latitude!])
          .setPopup(popup)
          .addTo(mapRef.current!);

        const el = marker.getElement();
        el.addEventListener("mouseenter", () => marker.togglePopup());
        el.addEventListener("mouseleave", () => marker.togglePopup());

        markersRef.current.push(marker);
      });
  }, [reports, userPosition, radius]);

  return (
    <div>
      <div style={{ marginBottom: 10 }}>
        <label>Filter radius: {radius} m</label>
        <input
          type="range"
          min={100}
          max={2000}
          step={50}
          value={radius}
          onChange={(e) => setRadius(Number(e.target.value))}
          style={{ width: "100%" }}
        />
      </div>
      <div ref={mapContainerRef} style={{ width: "100%", height: "400px" }} />
    </div>
  );
};

export default MapSection;
