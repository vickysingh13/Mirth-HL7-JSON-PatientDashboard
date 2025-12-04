import { useEffect, useState } from "react";

export default function VisitTable() {
  const [visits, setVisits] = useState([]);
  const [uploading, setUploading] = useState(null);

  useEffect(() => {
    fetchVisits();
  }, []);

  const fetchVisits = async () => {
    const res = await fetch("http://localhost:3000/api/patient-visits");
    const data = await res.json();
    setVisits(data);
  };

  const uploadEncounter = async (visit) => {
    setUploading(visit.visit_number);

    const encounter = {
      resourceType: "Encounter",
      id: visit.visit_number,
      status: "in-progress",
      class: {
        system: "http://terminology.hl7.org/CodeSystem/v3-ActCode",
        code: "IMP",
        display: "inpatient encounter",
      },
      subject: {
        reference: `Patient/${visit.fhir_patient_id}`,
        display: `${visit.first_name} ${visit.last_name}`,
      },
      identifier: [
        {
          system: "http://hospital.local/visit-number",
          value: visit.visit_number,
        },
      ],
      period: {
        start: new Date(visit.admit_datetime).toISOString(),
      },
    };

    const res = await fetch("http://localhost:3000/api/fhir/upload/encounter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(encounter),
    });

    const result = await res.json();
    alert(result.message || "Uploaded!");

    setUploading(null);
  };

  return (
    <div className="p-4 bg-white shadow rounded-md">
      <h2 className="text-2xl font-bold text-blue-700 mb-4">Patient Visits</h2>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">MRN</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Visit</th>
            <th className="border p-2">Admit Time</th>
            <th className="border p-2">FHIR Export</th>
          </tr>
        </thead>
        <tbody>
          {visits.map((v, idx) => (
            <tr key={idx} className="text-center">
              <td className="border p-2">{v.mrn}</td>
              <td className="border p-2">{v.first_name} {v.last_name}</td>
              <td className="border p-2">{v.visit_number}</td>
              <td className="border p-2">{v.admit_datetime}</td>
              <td className="border p-2">
                <button
                  onClick={() => uploadEncounter(v)}
                  disabled={uploading === v.visit_number}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                >
                  {uploading === v.visit_number ? "Uploading..." : "Upload FHIR"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
