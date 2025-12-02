import { useEffect, useState } from "react";

export default function PatientTable() {
  const [visits, setVisits] = useState([]);

  useEffect(() => {
    fetchVisits();
    const interval = setInterval(fetchVisits, 3000); // auto refresh every 3 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchVisits = async () => {
    const res = await fetch("http://localhost:3000/api/patient-visits");
    const data = await res.json();
    setVisits(data);
  };

  return (
    <div className="p-4 bg-white shadow rounded-md mt-6">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">Patient Visits</h2>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">MRN</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">DOB</th>
            <th className="border p-2">Gender</th>
            <th className="border p-2">Visit #</th>
            <th className="border p-2">Admit Time</th>
          </tr>
        </thead>
        <tbody>
          {visits.map((v, index) => (
            <tr key={index} className="text-center">
              <td className="border p-2">{v.mrn}</td>
              <td className="border p-2">{v.first_name} {v.last_name}</td>
              <td className="border p-2">{v.dob}</td>
              <td className="border p-2">{v.gender}</td>
              <td className="border p-2">{v.visit_number}</td>
              <td className="border p-2">{v.admit_datetime}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
