const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const fetch = require("node-fetch");
const http = require("http");

const app = express();
app.use(cors());
app.use(express.json());

// 🔌 Wrap Express with HTTP server (for WebSockets)
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: { origin: "*" },
});

// 🟢 PostgreSQL Connection
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "hl7_dashboard",
  password: "Admin@123",
  port: 5432,
});

pool
  .connect()
  .then(() => console.log("PostgreSQL Connected ✔️"))
  .catch((err) => console.error("DB Connection Error ❌", err));

// 🌐 WebSocket Connection
io.on("connection", () => console.log("WebSocket Client Connected 🔌"));

// 🔔 Notify UI when new visit arrives
function broadcastNewVisit(data) {
  io.emit("new_visit", data);
}

// ======================================================
// ➕ Store Patient + Visit + Create Encounter (from Mirth)
// ======================================================
app.post("/api/patient-visits", async (req, res) => {
  const d = req.body;

  try {
    // 1️⃣ Insert patient
    await pool.query(
      `INSERT INTO patients (mrn, first_name, last_name, dob, gender)
       VALUES ($1,$2,$3,$4,$5)
       ON CONFLICT (mrn) DO NOTHING`,
      [d.mrn, d.first_name, d.last_name, d.dob, d.gender]
    );

    // 2️⃣ Insert visit
    await pool.query(
      `INSERT INTO visits (mrn, visit_number, admit_datetime)
       VALUES ($1,$2,$3)`,
      [d.mrn, d.visit_number, d.admit_datetime]
    );

    // 🔔 Real-time UI update
    broadcastNewVisit(d);

    // 3️⃣ Create Encounter JSON
    const encounter = {
      resourceType: "Encounter",
      id: d.visit_number,
      status: "in-progress",
      class: {
        system: "http://terminology.hl7.org/CodeSystem/v3-ActCode",
        code: "IMP",
        display: "inpatient encounter",
      },
      subject: {
        reference: `Patient/${d.mrn}`,
        display: `${d.first_name} ${d.last_name}`,
      },
      identifier: [
        {
          system: "http://hospital.local/visit-number",
          value: d.visit_number,
        },
      ],
      period: {
        // store as proper ISO for FHIR
        start: new Date(d.admit_datetime).toISOString(),
      },
    };

    console.log("FHIR Encounter Created ✔️", encounter);

    // 🔔 Notify UI encounter created
    io.emit("new_encounter", {
      patient: `${d.first_name} ${d.last_name}`,
      visit: d.visit_number,
      time: d.admit_datetime,
    });

    res.status(201).json({
      message: "Visit + Encounter stored ✔️",
      encounter,
    });
  } catch (err) {
    console.error("Encounter Error ❌", err);
    res.status(500).json({ error: "Encounter failed" });
  }
});

// ======================================
// 📤 Fetch Dashboard Data (for frontend)
// ======================================
app.get("/api/patient-visits", async (_, res) => {
  try {
    const result = await pool.query(`
      SELECT p.mrn, p.first_name, p.last_name, p.dob, p.gender,
             v.visit_number, v.admit_datetime
      FROM patients p
      JOIN visits v ON p.mrn = v.mrn
      ORDER BY v.admit_datetime DESC;
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("Fetch failed ❌", err);
    res.status(500).json({ error: "Fetch failed" });
  }
});

// ==============================
// 🧬 Get FHIR Patient by MRN
// ==============================
app.get("/api/fhir/patient/:mrn", async (req, res) => {
  try {
    const p = (
      await pool.query(`SELECT * FROM patients WHERE mrn=$1`, [
        req.params.mrn,
      ])
    ).rows[0];

    if (!p) return res.status(404).json({ error: "Patient not found" });

    const fhirPatient = {
      resourceType: "Patient",
      id: p.mrn,
      identifier: [
        {
          system: "http://hospital.local/patients",
          value: p.mrn,
        },
      ],
      name: [
        {
          family: p.last_name,
          given: [p.first_name],
        },
      ],
      gender: p.gender === "M" ? "male" : "female",
      birthDate: p.dob,
    };

    res.json(fhirPatient);
  } catch (err) {
    console.error("FHIR Error ❌", err);
    res.status(500).json({ error: "FHIR Error ❌" });
  }
});

// =====================================
// 🌐 Upload Encounter to HAPI FHIR
// =====================================
app.post("/api/fhir/upload/encounter", async (req, res) => {
  try {
    const resp = await fetch("https://hapi.fhir.org/baseR4/Encounter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });

    const result = await resp.json();
    res.json({ message: "Encounter uploaded ✔️", result });
  } catch (err) {
    console.error("Upload failed ❌", err);
    res.status(500).json({ error: "Upload failed ❌" });
  }
});

// =====================================
// 🔐 Admin Delete Patient + Visits
// =====================================
app.delete("/api/remove-visit/:mrn", async (req, res) => {
  const key = req.headers["x-admin-key"];

  if (key !== "SINGH_MASTER_KEY") {
    return res.status(403).json({ error: "Unauthorized ❌" });
  }

  try {
    await pool.query(`DELETE FROM visits WHERE mrn = $1`, [req.params.mrn]);
    await pool.query(`DELETE FROM patients WHERE mrn = $1`, [req.params.mrn]);

    res.json({ message: "Patient + Visit removed successfully ✔️" });
  } catch (err) {
    console.error("Delete failed ❌", err);
    res.status(500).json({ error: "Delete failed ❌" });
  }
});

// =====================================
// 📁 CSV Export Endpoint
// =====================================
app.get("/api/export/csv", async (_, res) => {
  try {
    const result = await pool.query(`
      SELECT p.mrn, p.first_name, p.last_name, p.gender,
             v.visit_number, v.admit_datetime
      FROM patients p
      JOIN visits v ON p.mrn = v.mrn
      ORDER BY v.admit_datetime DESC;
    `);

    const csv = [
      "MRN,First Name,Last Name,Gender,Visit Number,Admit Time",
      ...result.rows.map(
        (r) =>
          `${r.mrn},${r.first_name},${r.last_name},${r.gender},${r.visit_number},${r.admit_datetime}`
      ),
    ].join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=patient_visits.csv"
    );
    res.send(csv);
  } catch (err) {
    console.error("CSV Export failed ❌", err);
    res.status(500).json({ error: "CSV Export failed ❌" });
  }
});

// 🚀 Start HTTP + WebSocket Server
server.listen(3000, () =>
  console.log("Backend + WS running ➜ http://localhost:3000")
);
