import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Header from "./components/Header";
import MapSection from "./components/MapSection";
import NewReport from "./components/NewReport";
import ReportsList from "./components/ReportList";
import StatsCard from "./components/StatsCard";
import { getMyReports, getReports } from "./services/reportService";
import { fetchUserInfo, type UserInfo } from "./services/userService";
import type { GlobalStats, User } from "./types";

function MainPage() {
  const [view, setView] = useState<"all" | "mine">("all");
  const [showNewReport, setShowNewReport] = useState(false);

  const navigate = useNavigate();

  // Fetch all reports
  const { data: allReports = [], isLoading: isLoadingAll } = useQuery({
    queryKey: ["reports"],
    queryFn: getReports,
  });

  // Fetch user's reports
  const { data: myReports = [], isLoading: isLoadingMy } = useQuery({
    queryKey: ["myReports"],
    queryFn: getMyReports,
  });

  const accessToken = localStorage.getItem("accessToken");
  const {
    data: userInfo,
    isLoading: isLoadingUser,
    isError: isUserError,
  } = useQuery<UserInfo, Error>({
    queryKey: ["userInfo", accessToken],
    queryFn: () => fetchUserInfo(accessToken!),
    enabled: !!accessToken,
    staleTime: Infinity,
    retry: false
  });

  const user: User | null = userInfo
    ? {
        username: `${userInfo.firstName} ${userInfo.lastName}`,
        reputation: 10,
        role: "user",
      }
    : null;

  const currentReports = view === "all" ? allReports : myReports;
  const currentReportsLoading = view === "all" ? isLoadingAll : isLoadingMy;

  const resolvedReportsCount = allReports.filter(
    (r) => r.status === "resolved"
  ).length;

  const globalStats: GlobalStats = {
    totalReports: allReports.length,
    resolvedReports: resolvedReportsCount,
  };

  const activeGlobal = globalStats.totalReports - globalStats.resolvedReports;

  useEffect(() => {
    if (!accessToken) {
      toast.error("Please log in to access this page.");
      navigate("/register-login", { replace: true });
    }
  }, [accessToken, navigate]);

  useEffect(() => {
    if (isUserError) {
      toast.error("Token expired, please log in again.");
      localStorage.removeItem("accessToken");
      navigate("/register-login", { replace: true });
    }
  }, [isUserError, navigate]);

  if (!accessToken || isLoadingUser || !user) {
    return (
      <div className="min-h-screen w-full bg-linear-to-b from-gray-50 to-white flex justify-center items-center text-3xl">
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
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {(() => {
            return (
              <>
                <StatsCard title="Your reputation" value={user.reputation} />
                <StatsCard title="Your reports" value={myReports.length} />
                <StatsCard title="Active reports" value={activeGlobal} />
              </>
            );
          })()}
        </div>

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
        {showNewReport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setShowNewReport(false)}
            />
            <div className="relative w-full max-w-2xl mx-4">
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

          <div>
            <ReportsList
              reports={currentReports}
              title={view === "mine" ? "My reports" : "All reports"}
              isLoading={currentReportsLoading}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default MainPage;
