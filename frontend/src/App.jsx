import PatientTable from "./components/PatientTable";
import GenderChart from "./components/GenderChart";
import AdmissionsChart from "./components/AdmissionsChart";
import { useEffect, useState } from "react";
import io from "socket.io-client";


export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100 p-6">
      <header>
        <h1 className="text-4xl font-bold text-blue-600 mb-2">
          HL7 → JSON → DB → FHIR Dashboard
        </h1>
        <p className="text-gray-600 mb-6">
          Real-time patient visits flowing from HL7 via Mirth Connect into a
          modern analytics UI.
        </p>
      </header>

      {/* Core Feature Section */}
      <section className="mt-2">
        <PatientTable />
      </section>

      {/* Analytics Section */}
      <section className="mt-10">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">
          📊 Patient Analytics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <GenderChart />
          <AdmissionsChart />
        </div>
      </section>

      {/* Footer */}
      <DashboardFooter />
    </div>
  );
}

function DashboardFooter() {
  const [online, setOnline] = useState(false);

  useEffect(() => {
    const socket = io("http://localhost:3000");

    socket.on("connect", () => setOnline(true));
    socket.on("disconnect", () => setOnline(false));

    return () => socket.disconnect();
  }, []);

  return (
    <footer className="mt-10 py-4 bg-gray-900 text-gray-300 rounded-md shadow-lg flex flex-col items-center gap-2">
      <a
        href="mailto:vickysinghofficial13@gmail.com?subject=HL7 Patient Dashboard Feedback"
        className="group flex items-center gap-2 hover:text-white transition-colors cursor-pointer"
        title="Contact Developer"
      >
        <span className="text-slate-400 group-hover:text-blue-400">{`</>`}</span>
        <span className="font-semibold text-slate-200 group-hover:text-blue-400">
          Built by SINGH
        </span>
      </a>

      {/* System Health */}
      <div className="flex flex-wrap justify-center items-center gap-3 bg-slate-800 px-3 py-1 rounded border border-slate-700">
        <span className="relative flex h-2 w-2">
          {online ? (
            <>
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </>
          ) : (
            <>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
            </>
          )}
        </span>

        <span className={online ? "text-emerald-400 font-medium" : "text-red-400 font-medium"}>
          {online ? "Online" : "Offline"}
        </span>

        <span className="text-slate-500">|</span>

        <span className="text-xs">
          {online ? `Sync: ${new Date().toLocaleTimeString()}` : "Waiting..."}
        </span>
      </div>
    </footer>
  );
}