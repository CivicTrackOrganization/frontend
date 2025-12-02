interface StatsCardProps {
  title: string;
  value: number;
}

function StatsCard({ title, value }: StatsCardProps) {
  return (
    <div className="p-6 bg-white shadow-md rounded-xl">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">{title}</span>
        <span className="text-3xl font-bold">{value}</span>
      </div>
    </div>
  );
}

export default StatsCard;