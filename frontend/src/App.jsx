import PatientTable from "./components/PatientTable";
import GenderChart from "./components/GenderChart";
import AdmissionsChart from "./components/AdmissionsChart";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-4xl font-bold text-blue-600 mb-6">
        HL7 → JSON → DB → FHIR Dashboard
      </h1>

      {/* Core Feature Section */}
      <div className="mt-4">
        <PatientTable />
      </div>

      {/* Analytics Section */}
      <h2 className="text-2xl font-semibold mt-10 mb-4 text-gray-700">
        📊 Patient Analytics
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GenderChart />
        <AdmissionsChart />
      </div>
    </div>
  );
}
