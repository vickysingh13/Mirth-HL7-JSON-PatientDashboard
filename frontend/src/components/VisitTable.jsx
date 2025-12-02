import React, { useEffect, useState } from "react";

export default function VisitTable() {
  const [visits, setVisits] = useState([]);

  // Fetch visits from backend
  useEffect(() => {
    fetch("http://localhost:3000/api/patient-visits")
      .then((res) => res.json())
      .then((data) => setVisits(data))
      .catch((err) => console.error("Error fetching visits:", err));
  }, []);

  return (
    <div className="overflow-x-auto mt-6">
      <table className="min-w-full bg-white border border-gray-200 shadow rounded-lg">
        <thead>
          <tr className="bg-blue-600 text-white">
            <th className="py-2 px-4 border">MRN</th>
            <th className="py-2 px-4 border">First Name</th>
            <th className="py-2 px-4 border">Last Name</th>
            <th className="py-2 px-4 border">DOB</th>
            <th className="py-2 px-4 border">Gender</th>
            <th className="py-2 px-4 border">Visit #</th>
            <th className="py-2 px-4 border">Admit Date</th>
          </tr>
        </thead>
        <tbody>
          {visits.map((v, i) => (
            <tr key={i} className="even:bg-gray-100">
              <td className="py-2 px-4 border">{v.mrn}</td>
              <td className="py-2 px-4 border">{v.first_name}</td>
              <td className="py-2 px-4 border">{v.last_name}</td>
              <td className="py-2 px-4 border">{v.dob}</td>
              <td className="py-2 px-4 border">{v.gender}</td>
              <td className="py-2 px-4 border">{v.visit_number}</td>
              <td className="py-2 px-4 border">{v.admit_datetime}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
