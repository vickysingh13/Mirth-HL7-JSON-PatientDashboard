import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:3000");

export default function PatientTable() {
  const [visits, setVisits] = useState([]);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchVisits();

    socket.on("new_visit", (d) => {
      setToast(`🆕 New Visit: ${d.first_name} ${d.last_name}`);
      fetchVisits();
      setTimeout(() => setToast(null), 4000);
    });

    socket.on("new_encounter", (msg) => {
      setToast(`🔥 Encounter Created: ${msg.patient} (${msg.visit})`);
      setTimeout(() => setToast(null), 4000);
    });
  }, []);

  const fetchVisits = async () => {
    const res = await fetch("http://localhost:3000/api/patient-visits");
    setVisits(await res.json());
  };

  const exportFHIRPatient = async (mrn) => {
    await fetch(`http://localhost:3000/api/fhir/patient/${mrn}`);
    window.alert("FHIR Patient Generated ✔️ Check console");
  };

  const uploadEncounter = async (encounter) => {
    const res = await fetch("http://localhost:3000/api/fhir/upload/encounter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(encounter)
    });
    window.alert("Encounter Uploaded ✔️ Check console");
    console.log(await res.json());
  };

  return (
    <div className="p-4 bg-white shadow rounded-md">
      <h2 className="text-2xl font-bold text-blue-700 mb-4">🏥 Patient Visit Records</h2>

      {toast && (
        <div className="p-2 mb-4 bg-green-200 text-green-900 rounded text-center font-semibold">
          {toast}
        </div>
      )}

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200 text-center">
            <th className="border p-2">MRN</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Gender</th>
            <th className="border p-2">Visit #</th>
            <th className="border p-2">Admit Time</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>

        <tbody>
          {visits.map((v, i) => (
            <tr key={i} className="text-center">
              <td className="border p-2">{v.mrn}</td>
              <td className="border p-2">{v.first_name} {v.last_name}</td>
              <td className="border p-2">{v.gender}</td>
              <td className="border p-2">{v.visit_number}</td>
              <td className="border p-2">{v.admit_datetime}</td>
              <td className="border p-2 flex gap-2 justify-center">
                <button className="bg-blue-600 text-white px-3 py-1 rounded"
                        onClick={() => exportFHIRPatient(v.mrn)}>
                  FHIR Patient
                </button>

                <button className="bg-green-600 text-white px-3 py-1 rounded"
                        onClick={() =>
                          uploadEncounter({
                            resourceType: "Encounter",
                            id: v.visit_number,
                            status: "in-progress",
                            subject: { reference: `Patient/${v.mrn}` },
                            period: { start: v.admit_datetime + "Z" },
                            identifier: [
                              {
                                system: "http://hospital.local/visit",
                                value: v.visit_number,
                              },
                            ],
                          })
                        }>
                  Upload Encounter
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
