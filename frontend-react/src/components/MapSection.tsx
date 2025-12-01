import React, { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const MapSection: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const coords : [number, number] = [19.906864041831486,50.03011538986579]

  useEffect(() => {
    if (mapRef.current) return;

    if (mapContainerRef.current) {
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: coords,
        zoom: 10
      });

      new mapboxgl.Marker().setLngLat(coords).addTo(mapRef.current);
    }
  }, []);

  return (
    <div
      ref={mapContainerRef}
      style={{ width: "100%", height: "400px" }}
    />
  );
};

export default MapSection;