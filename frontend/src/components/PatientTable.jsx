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

    // optional cleanup
    return () => {
      socket.off("new_visit");
      socket.off("new_encounter");
    };
  }, []);

  const fetchVisits = async () => {
    const res = await fetch("http://localhost:3000/api/patient-visits");
    const data = await res.json();
    setVisits(data);
  };

  const exportFHIRPatient = async (mrn) => {
    const res = await fetch(`http://localhost:3000/api/fhir/patient/${mrn}`);
    const data = await res.json();
    window.alert("FHIR Patient Generated ✔️ (check console)");
    console.log("FHIR Patient:", data);
  };

  const uploadEncounter = async (encounter) => {
    const res = await fetch(
      "http://localhost:3000/api/fhir/upload/encounter",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(encounter),
      }
    );
    const result = await res.json();
    window.alert("Encounter Uploaded ✔️ (check console)");
    console.log("FHIR Encounter Upload Response:", result);
  };

  const deleteVisit = async (mrn) => {
    const key = window.prompt("Enter Admin Key to delete:");
    if (!key) return;
    if (key !== "SINGH_MASTER_KEY") {
      window.alert("Invalid Key ❌");
      return;
    }

    const res = await fetch(
      `http://localhost:3000/api/remove-visit/${mrn}`,
      {
        method: "DELETE",
        headers: {
          "x-admin-key": key,
        },
      }
    );

    if (res.ok) {
      window.alert("Record deleted ✔️");
      fetchVisits();
    } else {
      window.alert("Delete failed ❌");
    }
  };

  const exportCSV = () => {
    window.location.href = "http://localhost:3000/api/export/csv";
  };

  return (
    <div className="p-4 bg-white shadow rounded-md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-blue-700">
          🏥 Patient Visit Records
        </h2>
        <button
          onClick={exportCSV}
          className="bg-purple-600 text-white px-3 py-1 rounded text-sm"
        >
          ⬇ Export CSV
        </button>
      </div>

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
              <td className="border p-2">
                {v.first_name} {v.last_name}
              </td>
              <td className="border p-2">{v.gender}</td>
              <td className="border p-2">{v.visit_number}</td>
              <td className="border p-2">{v.admit_datetime}</td>
              <td className="border p-2">
                <div className="flex flex-wrap gap-2 justify-center">
                  <button
                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
                    onClick={() => exportFHIRPatient(v.mrn)}
                  >
                    FHIR Patient
                  </button>

                  <button
                    className="bg-green-600 text-white px-3 py-1 rounded text-sm"
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
                    }
                  >
                    Upload Encounter
                  </button>

                  <button
                    className="bg-red-600 text-white px-3 py-1 rounded text-sm"
                    onClick={() => deleteVisit(v.mrn)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}

          {visits.length === 0 && (
            <tr>
              <td
                className="border p-4 text-center text-gray-500"
                colSpan={6}
              >
                No visits yet. Drop an HL7 file into Mirth inbound to start
                the flow.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
