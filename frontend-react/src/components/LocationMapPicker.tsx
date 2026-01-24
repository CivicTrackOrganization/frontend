import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

interface LocationMapPickerProps {
  onLocationSelect: (lat: number, lng: number, address: string) => void;
  initialLat?: number;
  initialLng?: number;
}

const LocationMapPicker: React.FC<LocationMapPickerProps> = ({
  onLocationSelect,
  initialLat = 50.03011538986579,
  initialLng = 19.906864041831486,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [selectedCoords, setSelectedCoords] = useState<{
    lat: number;
    lng: number;
  }>({ lat: initialLat, lng: initialLng });
  const [mapCenter, setMapCenter] = useState<{
    lat: number;
    lng: number;
  }>({ lat: initialLat, lng: initialLng });
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Array<{
    id: string;
    name: string;
    place_name: string;
    center: [number, number];
  }>>([]);
  const [isSearching, setIsSearching] = useState(false);

  const reverseGeocode = async (lng: number, lat: number): Promise<string> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();
      
      if (data.display_name) {
        return data.display_name;
      }
      return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    } catch (error) {
      console.error("Reverse geocoding error:", error);
      return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    }
  };

  const onLocationSelectRef = useRef(onLocationSelect);

useEffect(() => {
  onLocationSelectRef.current = onLocationSelect;
}, [onLocationSelect]);

useEffect(() => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setMapCenter({ lat: latitude, lng: longitude });
        setSelectedCoords({ lat: latitude, lng: longitude });

        const address = await reverseGeocode(longitude, latitude);
        onLocationSelectRef.current(latitude, longitude, address);

        if (mapRef.current) {
          mapRef.current.flyTo({
            center: [longitude, latitude],
            zoom: 13,
            duration: 500,
          });
          if (markerRef.current) {
            markerRef.current.setLngLat([longitude, latitude]);
          }
        }
      },
      (error) => {
        console.log("Geolocation error:", error.message);
      }
    );
  }
}, []);

useEffect(() => {
  mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
  if (mapRef.current) return;

  if (mapContainerRef.current) {
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [mapCenter.lng, mapCenter.lat],
      zoom: 13,
    });

    markerRef.current = new mapboxgl.Marker({ color: "purple" })
      .setLngLat([mapCenter.lng, mapCenter.lat])
      .addTo(mapRef.current);

    mapRef.current.getCanvas().style.cursor = "pointer";

    const handleMapClick = async (e: mapboxgl.MapMouseEvent) => {
      const { lng, lat } = e.lngLat;
      setSelectedCoords({ lat, lng });
      markerRef.current?.setLngLat([lng, lat]);
      const address = await reverseGeocode(lng, lat);
      onLocationSelect(lat, lng, address);
    };

    mapRef.current.on("click", handleMapClick);
  }

  return () => {
    mapRef.current?.remove();
    mapRef.current = null;
  };
  
}, []); 

  const handleCenterMap = () => {
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [selectedCoords.lng, selectedCoords.lat],
        zoom: 15,
        duration: 1000,
      });
    }
  };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setMapCenter({ lat: latitude, lng: longitude });
          setSelectedCoords({ lat: latitude, lng: longitude });
          
          const address = await reverseGeocode(longitude, latitude);
          onLocationSelect(latitude, longitude, address);
          
          if (mapRef.current) {
            mapRef.current.flyTo({
              center: [longitude, latitude],
              zoom: 13,
              duration: 500,
            });
            if (markerRef.current) {
              markerRef.current.setLngLat([longitude, latitude]);
            }
          }
        },
        (error) => {
          alert("Unable to access your location. Please check your browser permissions.");
        }
      );
    }
  };

  const handleSearchAddress = async (query: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5`
      );
      const data = await response.json();
      
      if (Array.isArray(data)) {
        setSearchResults(data.map((feature: any) => ({
          id: feature.place_id,
          name: feature.name,
          place_name: feature.display_name,
          center: [parseFloat(feature.lon), parseFloat(feature.lat)],
        })));
      }
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    searchTimeoutRef.current = setTimeout(() => {
      handleSearchAddress(query);
    }, 500);
  };

  const handleSelectSearchResult = (result: typeof searchResults[0]) => {
    const [lng, lat] = result.center;
    setSearchQuery("");
    setSearchResults([]);
    setSelectedCoords({ lat, lng });
    onLocationSelect(lat, lng, result.place_name);
    
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [lng, lat],
        zoom: 15,
        duration: 500,
      });
      if (markerRef.current) {
        markerRef.current.setLngLat([lng, lat]);
      }
    }
  };

  return (
    <div className="w-full space-y-2">
      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search address..."
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
        {isSearching && (
          <div className="absolute right-3 top-2.5">
            <div className="w-4 h-4 border-2 border-blue-600 rounded-full animate-spin border-t-transparent"></div>
          </div>
        )}
        
        {/* Search Results Dropdown */}
        {searchResults.length > 0 && (
          <div className="absolute left-0 right-0 z-20 mt-0.5 bg-white border border-gray-200 rounded-lg shadow-md top-full max-h-48 overflow-y-auto">
            {searchResults.map((result) => (
              <button
                key={result.id}
                type="button"
                onClick={() => handleSelectSearchResult(result)}
                className="w-full px-3 py-1.5 text-xs text-left text-gray-700 transition border-b hover:bg-blue-50 last:border-b-0"
              >
                <div className="font-medium line-clamp-1">{result.name}</div>
                <div className="text-xs text-gray-500 line-clamp-1">{result.place_name}</div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Map Container */}
      <div className="relative">
        <div
          ref={mapContainerRef}
          style={{ width: "100%", height: "380px" }}
          className="overflow-hidden bg-gray-100 border border-gray-200 rounded-lg"
        />
      </div>

      {/* Controls and Info */}
      <div className="grid grid-cols-3 gap-2">
        <div className="p-2 space-y-1 border border-gray-200 rounded bg-gray-50">
          <p className="text-xs text-gray-600 truncate">
            <span className="font-semibold">Lat:</span> <span className="font-mono text-xs">{selectedCoords.lat.toFixed(4)}</span>
          </p>
          <p className="text-xs text-gray-600 truncate">
            <span className="font-semibold">Lng:</span> <span className="font-mono text-xs">{selectedCoords.lng.toFixed(4)}</span>
          </p>
        </div>
        
        <div className="flex col-span-2 gap-1">
          <button
            type="button"
            onClick={handleGetCurrentLocation}
            className="flex-1 px-2 py-2 text-base font-medium text-white transition bg-green-600 rounded hover:bg-green-700"
            title="Use my current location"
          >
            Current Location
          </button>
          <button
            type="button"
            onClick={handleCenterMap}
            className="flex-1 px-2 py-2 text-base font-medium text-white transition bg-blue-600 rounded hover:bg-blue-700"
            title="Center map"
          >
            Center Map
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationMapPicker;
