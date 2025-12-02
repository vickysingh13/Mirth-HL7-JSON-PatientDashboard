import VisitTable from "./components/VisitTable";
import GenderChart from "./components/GenderChart";
import AdmissionsChart from "./components/AdmissionsChart";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-4xl font-bold text-blue-600 mb-6">
        HL7 Patient Visit Dashboard
      </h1>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GenderChart />
        <AdmissionsChart />
      </div>

      {/* Table Section */}
      <div className="mt-8">
        <VisitTable />
      </div>
    </div>
  );
}
