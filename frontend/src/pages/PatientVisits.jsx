import { useEffect, useState } from "react";

export default function PatientVisits() {
  const [visits, setVisits] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/patient-visits")
      .then(res => res.json())
      .then(data => setVisits(data))
      .catch(err => console.error("Fetch error:", err));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-purple-700">
        HL7 Patient Visit Dashboard
      </h1>

      <table className="min-w-full border border-gray-300 rounded-lg shadow-md">
        <thead className="bg-purple-200">
          <tr>
            <th className="p-3 border">MRN</th>
            <th className="p-3 border">First Name</th>
            <th className="p-3 border">Last Name</th>
            <th className="p-3 border">DOB</th>
            <th className="p-3 border">Gender</th>
            <th className="p-3 border">Visit Number</th>
            <th className="p-3 border">Admit Date</th>
          </tr>
        </thead>

        <tbody>
          {visits.map((v, i) => (
            <tr key={i} className="hover:bg-gray-100 transition">
              <td className="p-2 border">{v.mrn}</td>
              <td className="p-2 border">{v.firstName}</td>
              <td className="p-2 border">{v.lastName}</td>
              <td className="p-2 border">{v.dob}</td>
              <td className="p-2 border">{v.gender}</td>
              <td className="p-2 border">{v.visitNumber}</td>
              <td className="p-2 border">{v.admitDateTime}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
