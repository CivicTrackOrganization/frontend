import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Header from "./components/Header";
import MapSection from "./components/MapSection";
import NewReport from "./components/NewReport";
import ReportDetailsModal from "./components/ReportDetailsModal";
import ReportsList from "./components/ReportList";
import StatsCard from "./components/StatsCard";
import { getMyReports, getReports } from "./services/reportService";
import { fetchUserInfo, type UserInfo } from "./services/userService";
import type { Report, User } from "./types";

function MainPage() {
  const [view, setView] = useState<"all" | "mine">("all");
  const [showNewReport, setShowNewReport] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState<number | null>(null);

  const {
    data: allReports,
    isLoading: isLoadingAll,
    isError: isErrorAll,
  } = useQuery({
    queryFn: getReports,
    queryKey: ["reports"],
  });

  const {
    data: myReports,
    isLoading: isLoadingMy,
    isError: isErrorMy,
  } = useQuery({
    queryKey: ["myReports"],
    queryFn: getMyReports,
  });

  const accessToken = localStorage.getItem("accessToken");
  const {
    data: userInfo,
    isLoading: isLoadingUser,
    error: userError,
  } = useQuery<UserInfo, Error>({
    queryKey: ["userInfo", accessToken],
    queryFn: () => fetchUserInfo(accessToken!),
    enabled: !!accessToken,
    staleTime: Infinity,
    retry: false,
  });

  const calculateReputation = (reports: Report[] | undefined) => {
    if (!reports) return 0;

    const totalReports = reports.length;
    const totalForResolved = reports
      .filter((report) => report.status === "resolved")
      .reduce((acc, r) => acc + (r.votesFor ?? 0), 0);
    const totalAgainstRejected = reports
      .filter((report) => report.status === "rejected")
      .reduce((acc, r) => acc + (r.votesAgainst ?? 0), 0);

    const reputation =
      (totalReports + totalForResolved + totalAgainstRejected) * 10;

    return Math.max(0, reputation);
  };

  const userReputation = calculateReputation(myReports);

  const user: User | null = userInfo
    ? {
        username: `${userInfo.firstName} ${userInfo.lastName}`,
        reputation: userReputation,
        role: userInfo.role,
      }
    : null;

  const currentReports = view === "all" ? allReports : myReports;
  const currentReportsLoading = view === "all" ? isLoadingAll : isLoadingMy;

  const calculateResolvedReportsCount = (reports: Array<Report>) => {
    return reports.filter((r) => r.status === "resolved").length;
  };

  useEffect(() => {
    if (!userError) return;
    toast.error("Failed to load user data. Please refresh the page.");
  }, [userError]);

  if (isLoadingUser || !user || !userInfo) {
    return (
      <div className="flex items-center justify-center w-full min-h-screen text-3xl bg-linear-to-b from-gray-50 to-white">
        Loading user data...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
      <Header
        username={user.username}
        reputation={user.reputation}
        role={user.role}
      />
      <main className="p-6 mx-auto space-y-6 max-w-7xl">
        {user.role === "citizen" ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <StatsCard title="Your reputation" value={user.reputation} />
            {!isLoadingMy && !isErrorMy && myReports && (
              <StatsCard title="Your reports" value={myReports.length} />
            )}
            {!isLoadingAll && !isErrorAll && allReports && (
              <StatsCard
                title="Active reports"
                value={
                  allReports.length - calculateResolvedReportsCount(allReports)
                }
              />
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 shadow-sm">
              <p className="text-sm font-medium text-blue-700">New</p>
              <p className="text-3xl font-bold text-blue-900 mt-1">
                {allReports
                  ? allReports.filter((r) => r.status === "new").length
                  : "-"}
              </p>
            </div>
            <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4 shadow-sm">
              <p className="text-sm font-medium text-yellow-700 ">
                In Progress
              </p>
              <p className="text-3xl font-bold text-yellow-900 mt-1">
                {allReports
                  ? allReports.filter((r) => r.status === "in_progress").length
                  : "-"}
              </p>
            </div>
            <div className="bg-green-50 border border-green-100 rounded-xl p-4 shadow-sm">
              <p className="text-sm font-medium text-green-700">Resolved</p>
              <p className="text-3xl font-bold text-green-900 mt-1">
                {allReports
                  ? allReports.filter((r) => r.status === "resolved").length
                  : "-"}
              </p>
            </div>
            <div className="bg-red-50 border border-red-100 rounded-xl p-4 shadow-sm">
              <p className="text-sm font-medium text-red-700 ">Rejected</p>
              <p className="text-3xl font-bold text-red-900 mt-1">
                {allReports
                  ? allReports.filter((r) => r.status === "rejected").length
                  : "-"}
              </p>
            </div>
          </div>
        )}

        {user.role === "citizen" && (
          <div className="flex items-center justify-between p-6 text-white shadow-lg rounded-xl bg-linear-to-r from-indigo-600 to-purple-600">
            <div>
              <h2 className="text-2xl font-semibold">Report a new problem</h2>
              <p className="text-sm opacity-90">
                Help improve the city — report a problem in your area
              </p>
            </div>
            <button
              onClick={() => setShowNewReport(true)}
              className="px-4 py-2 text-indigo-700 bg-white rounded-lg shadow cursor-pointer hover:opacity-95"
            >
              New Report
            </button>
          </div>
        )}
        {showNewReport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setShowNewReport(false)}
            />
            <div
              className="relative w-11/12 max-w-5xl max-h-[90vh] overflow-y-auto mx-4 modal-scroll"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              <div className="relative p-6 bg-white rounded-lg shadow-lg">
                <button
                  onClick={() => setShowNewReport(false)}
                  aria-label="Close"
                  title="Close"
                  className="absolute flex items-center justify-center text-gray-700 bg-gray-100 rounded-full top-3 right-3 w-9 h-9 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <NewReport />
              </div>
            </div>
          </div>
        )}
        <div className="space-y-6">
          <MapSection />

          {user.role !== "moderator" && (
            <div className="p-3 bg-white shadow-sm rounded-xl">
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setView("all")}
                      className={`px-4 py-2 text-sm rounded-full cursor-pointer ${
                        view === "all"
                          ? "text-white bg-blue-600"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setView("mine")}
                      className={`px-4 py-2 text-sm rounded-full cursor-pointer ${
                        view === "mine"
                          ? "text-white bg-blue-600"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      My reports
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div>
            {!currentReports ? (
              <p>Loading reports...</p>
            ) : (
              <ReportsList
                reports={currentReports}
                title={view === "mine" ? "My reports" : "All reports"}
                isLoading={currentReportsLoading}
                onReportSelected={setSelectedReportId}
              />
            )}
          </div>
        </div>
      </main>

      {selectedReportId && (
        <ReportDetailsModal
          reportId={selectedReportId}
          onClose={() => setSelectedReportId(null)}
          userId={userInfo.id}
          isUserModerator={user.role === "moderator"}
        />
      )}
    </div>
  );
}

export default MainPage;
