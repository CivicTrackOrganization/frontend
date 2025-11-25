interface MapSectionProps {
  className?: string;
}

function MapSection({ className }: MapSectionProps) {
  return (
    <div className={`bg-white rounded-xl shadow flex flex-col overflow-hidden ${className}`}>
      <div className="px-4 py-3 text-white bg-linear-to-r from-blue-600 to-indigo-600">
        <h2 className="font-semibold">Report Map</h2>
        <p className="text-xs opacity-90">See all reports on the city map</p>
      </div>
      <div className="flex-1 p-4">
        <div className="w-full h-full overflow-hidden border rounded">
          <iframe
            title="City map"
            className="w-full h-full border-none"
            src="https://www.openstreetmap.org/export/embed.html?bbox=20.95%2C52.20%2C21.08%2C52.25&layer=mapnik&marker=52.2297%2C21.0122"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
}

export default MapSection;