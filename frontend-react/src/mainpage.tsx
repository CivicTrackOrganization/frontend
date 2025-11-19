// WIP (switch to moderator view is temporary)
// TO DO: refactor, extract components, add rep system, make the buttons work properly
import { useState } from "react";

interface User {
  username: string;
  reputation: number;
  reports: number;
  isModerator: boolean;
}

interface GlobalStats {
  totalReports: number;
  resolvedReports: number;
}

interface Report {
  title: string;
  description: string;
  location: string;
  priority: string;
  status: string;
}

interface HeaderProps {
  username: string;
  reputation: number;
  isModerator: boolean;
  onToggleModerator: () => void;
}

function Header({ username, reputation, isModerator, onToggleModerator }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white shadow-sm">
      <div className="flex items-center gap-3">
        <img src="/logo.png" alt="CivicTrack" className="w-10 h-10 rounded-md" />
        <div>
          <h1 className="text-lg font-semibold">CivicTrack</h1>
          <p className="text-xs text-gray-500">City issue reporting system</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="font-medium">{username} {isModerator && <span className="ml-2 px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded">Moderator</span>}</p>
          <p className="text-sm text-gray-500">Reputation: {reputation}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleModerator}
            className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200"
          >
            {isModerator ? 'Switch to user' : 'Switch to moderator'}
          </button>
          <button className="px-4 py-2 bg-white border border-gray-200 rounded shadow-sm hover:bg-gray-50">Log out</button>
        </div>
      </div>
    </header>
  );
}

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

interface MapSectionProps {
  className?: string;
}

function MapSection({ className }: MapSectionProps) {
  return (
    <div className={`bg-white rounded-xl shadow ${className}`}>
      <div className="px-4 py-3 text-white bg-linear-to-r from-blue-600 to-indigo-600 rounded-t-xl">
        <h2 className="font-semibold">Report Map</h2>
        <p className="text-xs opacity-90">See all reports on the city map</p>
      </div>
      <div className="p-4">
            <div className="w-full overflow-hidden border rounded h-72">
              <iframe
                title="City map"
                className="w-full h-full"
                src="https://www.openstreetmap.org/export/embed.html?bbox=20.95%2C52.20%2C21.08%2C52.25&layer=mapnik&marker=52.2297%2C21.0122"
                frameBorder={0}
                loading="lazy"
              />
            </div>
            <div className="mt-2 text-xs text-gray-500">
              <a
                href="https://www.openstreetmap.org/#map=13/52.2297/21.0122"
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 underline"
              >
                Open in OpenStreetMap
              </a>
            </div>
      </div>
    </div>
  );
}

interface ReportItemProps {
  report: Report;
}

function ReportItem({ report }: ReportItemProps) {
  return (
    <div className="p-4 mb-3 bg-white rounded-lg shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-block px-2 py-0.5 text-xs text-gray-700 bg-gray-100 rounded">Infrastructure</span>
            <span className="inline-block px-2 py-0.5 text-xs text-red-700 bg-red-100 rounded">High</span>
          </div>
          <p className="font-semibold">{report.title}</p>
          <p className="text-sm text-gray-600">{report.description}</p>
            <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
              <span>📍 {report.location}</span>
              <span>🗓 Nov 1, 2024 01:00</span>
            </div>
        </div>
        <div className="flex flex-col items-end gap-2">
           <span className="px-3 py-1 text-xs text-yellow-800 bg-yellow-100 rounded">Verified</span>
        </div>
      </div>
    </div>
  );
}

interface ReportsListProps {
  reports: Report[];
}

function ReportsList({ reports }: ReportsListProps) {
  return (
    <div className="h-full bg-white shadow-sm rounded-xl">
      <div className="px-4 py-3 border-b">
        <h2 className="font-semibold">Reports in your area</h2>
        <p className="text-xs text-gray-500">Confirm and comment on reports from other users</p>
      </div>
      <div className="p-4 overflow-y-auto h-72">
        {reports.map((report, index) => (
          <ReportItem key={index} report={report} />
        ))}
      </div>
    </div>
  );
}

function ModeratorPanel({ reports, onApprove, onReject }: { reports: Report[]; onApprove: (i: number) => void; onReject: (i: number) => void; }) {
  return (
    <div className="h-full bg-white shadow-sm rounded-xl">
      <div className="px-4 py-3 border-b">
        <h2 className="font-semibold">Moderator Panel</h2>
        <p className="text-xs text-gray-500">Review and moderate incoming reports</p>
      </div>
      <div className="p-4 space-y-3 overflow-y-auto h-72">
        {reports.map((report, index) => (
          <div key={index} className="p-3 border rounded-md bg-gray-50">
            <p className="font-medium">{report.title}</p>
            <p className="text-sm text-gray-600">{report.description}</p>
            <div className="flex items-center gap-2 mt-3">
              <button onClick={() => onApprove(index)} className="px-3 py-1 text-sm text-white bg-green-600 rounded">Approve</button>
              <button onClick={() => onReject(index)} className="px-3 py-1 text-sm text-white bg-red-600 rounded">Reject</button>
              <span className="ml-auto text-xs text-gray-500">{report.location}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface NewReportProps {
  onAddReport: (report: Report) => void;
}

function NewReport({ onAddReport }: NewReportProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [priority, setPriority] = useState("Normal");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newReport: Report = {
      title,
      description,
      location,
      priority,
      status: "New",
    };
    onAddReport(newReport);

    setTitle("");
    setDescription("");
    setLocation("");
    setPriority("Normal");
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="mb-4 font-semibold">Add new report</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="Low">Niski</option>
          <option value="Normal">Normal</option>
          <option value="High">Wysoki</option>
        </select>
        <button
          type="submit"
          className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          Add report
        </button>
      </form>
    </div>
  );
}


function MainPage() {
  const [user, setUser] = useState<User>({
    username: "Paweł Kowalski",
    reputation: 15000,
    reports: 3,
    isModerator: false,
  });

  const [globalStats] = useState<GlobalStats>({
    totalReports: 1200,
    resolvedReports: 950,
  });

  const [reports, setReports] = useState<Report[]>([
    {
      title: "Dziura w jezdni na ul. Głównej",
      description:
        "Duża dziura w asfalcie, zagrożenie dla kierowców. Około 50cm średnicy.",
      location: "ul. Główna 15, Warszawa",
      priority: "High",
      status: "Verified",
    },
  ]);

  const handleAddReport = (report: Report) => {
    setReports((prev) => [report, ...prev]);
  };

  const handleApprove = (index: number) => {
    setReports((prev) => prev.map((r, i) => (i === index ? { ...r, status: 'Verified' } : r)));
  };

  const handleReject = (index: number) => {
    setReports((prev) => prev.map((r, i) => (i === index ? { ...r, status: 'Rejected' } : r)));
  };

  const toggleModerator = () => setUser((u) => ({ ...u, isModerator: !u.isModerator }));

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
      <Header username={user.username} reputation={user.reputation} isModerator={user.isModerator} onToggleModerator={toggleModerator} />
      <main className="p-6 mx-auto space-y-6 max-w-7xl">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <StatsCard title="Your reputation" value={user.reputation} />
            <StatsCard title="Your reports" value={user.reports} />
            <StatsCard title="Active reports" value={globalStats.totalReports - globalStats.resolvedReports} />
        </div>

        <div className="flex items-center justify-between p-6 text-white shadow-lg rounded-xl bg-linear-to-r from-indigo-600 to-purple-600">
          <div>
            <h2 className="text-2xl font-semibold">Report a new problem</h2>
            <p className="text-sm opacity-90">Help improve the city — report a problem in your area</p>
          </div>
          <button className="px-4 py-2 text-indigo-700 bg-white rounded-lg shadow hover:opacity-95">+ New Report</button>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <MapSection className="lg:col-span-2" />

          <div className="flex flex-col gap-4">
            <div className="p-3 bg-white shadow-sm rounded-xl">
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <button className="px-4 py-2 text-sm text-white bg-blue-600 rounded-full">Nearby</button>
                    <button className="px-4 py-2 text-sm bg-gray-100 rounded-full">My reports</button>
                  </div>
                </div>
              </div>
            </div>

            {user.isModerator ? (
              <ModeratorPanel reports={reports} onApprove={handleApprove} onReject={handleReject} />
            ) : (
              <ReportsList reports={reports} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default MainPage;