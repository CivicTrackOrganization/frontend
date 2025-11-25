import { useState } from "react";
import Header from "./components/Header";
import StatsCard from "./components/StatsCard";
import MapSection from "./components/MapSection";
import ReportsList from "./components/ReportList";
import ModeratorPanel from "./components/ModeratorPanel";
import NewReport from "./components/NewReport";
import type { User, Report, GlobalStats} from "./types";



function MainPage() {
  const [user, setUser] = useState<User>({
    username: "Paweł Kowalski",
    reputation: 15000,
    reports: 3,
    role: "user",
  });

  const [reports, setReports] = useState<Report[]>([
    {
      title: "Pothole on Główna Street",
      description:
        "Large pothole in the asphalt, a hazard for drivers. Approximately 50 cm in diameter.",
      location: "Główna St 15, Warsaw",
      priority: "High",
      status: "Resolved",
      author: user.username,
      reportType: "infrastructure",
      assignedUnit: "maintenance",
      createdAt: new Date(),
    },
    {
      title: "Broken streetlight on Słoneczna",
      description: "Streetlight is out, area is poorly lit at night.",
      location: "Słoneczna 3, Warsaw",
      priority: "Normal",
      status: "New",
      author: "Inna Osoba",
      reportType: "infrastructure",
      assignedUnit: "general",
      createdAt: new Date(),
    },
  ]);

  const [globalStats] = useState<GlobalStats>({
    totalReports: 1200,
    resolvedReports: 950,
  });

  const [view, setView] = useState<'nearby' | 'mine'>('nearby');
  const [showNewReport, setShowNewReport] = useState(false);

  const handleAddReport = (report: Report) => {
    const reportWithAuthor: Report = { ...report, author: report.author ?? user.username };
    setReports((prev) => [reportWithAuthor, ...prev]);
    setShowNewReport(false);
  };

  const handleApprove = (index: number) => {
    setReports((prev) => prev.map((r, i) => (i === index ? { ...r, status: 'Resolved' } : r)));
  };

  const handleReject = (index: number) => {
    setReports((prev) => prev.map((r, i) => (i === index ? { ...r, status: 'Rejected' } : r)));
  };

  const toggleModerator = () => setUser((u) => ({ ...u, role: u.role === 'moderator' ? 'user' : 'moderator' }));

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
      <Header username={user.username} reputation={user.reputation} role={user.role} onToggleModerator={toggleModerator} />
      <main className="p-6 mx-auto space-y-6 max-w-7xl">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {(() => {
            const yourReports = reports.filter((r) => r.author === user.username).length;
            const activeGlobal = globalStats.totalReports - globalStats.resolvedReports;
            return (
              <>
                <StatsCard title="Your reputation" value={user.reputation} />
                <StatsCard title="Your reports" value={yourReports} />
                <StatsCard title="Active reports" value={activeGlobal} />
              </>
            );
          })()}
        </div>

        <div className="flex items-center justify-between p-6 text-white shadow-lg rounded-xl bg-linear-to-r from-indigo-600 to-purple-600">
          <div>
            <h2 className="text-2xl font-semibold">Report a new problem</h2>
            <p className="text-sm opacity-90">Help improve the city — report a problem in your area</p>
          </div>
          <button onClick={() => setShowNewReport(true)} className="px-4 py-2 text-indigo-700 bg-white rounded-lg shadow cursor-pointer hover:opacity-95">New Report</button>
        </div>
      {showNewReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowNewReport(false)} />
          <div className="relative w-full max-w-2xl mx-4">
            <div className="relative p-6 bg-white rounded-lg shadow-lg">
              <button
                onClick={() => setShowNewReport(false)}
                aria-label="Close"
                title="Close"
                className="absolute px-2 py-1 text-3xl leading-none text-gray-600 top-3 right-3 hover:text-gray-900"
              >
                ×
              </button>
              <NewReport onAddReport={handleAddReport} user={user} />
            </div>
          </div>
        </div>
      )}
        <div className="space-y-6">
          <MapSection className="w-full h-[640px]" />

          <div className="p-3 bg-white shadow-sm rounded-xl">
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setView('nearby')}
                    className={`px-4 py-2 text-sm rounded-full cursor-pointer ${view === 'nearby' ? 'text-white bg-blue-600' : 'bg-gray-100 text-gray-700'}`}
                  >
                    Nearby
                  </button>
                  <button
                    onClick={() => setView('mine')}
                    className={`px-4 py-2 text-sm rounded-full cursor-pointer ${view === 'mine' ? 'text-white bg-blue-600' : 'bg-gray-100 text-gray-700'}`}
                  >
                    My reports
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div>
            {user.role == 'moderator' ? (
              <ModeratorPanel reports={reports} onApprove={handleApprove} onReject={handleReject} />
              ) : (
              <ReportsList
                reports={view === 'mine' ? reports.filter((r) => r.author === user.username) : reports}
                title={view === 'mine' ? 'My reports' : 'Reports in your area'}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default MainPage;