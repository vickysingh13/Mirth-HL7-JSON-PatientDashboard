# 🏥 Mirth-HL7-JSON-PatientDashboard

A real healthcare integration workflow that ingests **HL7 ADT messages**, processes them via **Mirth Connect**, transforms them into **JSON**, and visualizes patient insights on a **React dashboard**.

---

## 🚀 Architecture

HL7 (.hl7 files)
↓
Mirth Connect (HL7 → JSON)
↓
Node.js API (stores & serves JSON)
↓
React Dashboard (Realtime Viz)

yaml
Copy code

---

## 🧰 Tech Stack

| Layer               | Technology               |
|--------------------|--------------------------|
| Integration Engine | Mirth Connect 4.5.2       |
| HL7 Format         | ADT^A01 Messages          |
| Backend            | Node.js, Express         |
| Frontend           | React + Vite + TailwindCSS |
| Charts             | Recharts                 |

---

## 📂 Project Structure

hl7-dashboard-backend/
server.js
package.json

hl7-dashboard/
src/components
public/
tailwind.config.js

samples/hl7/
screenshots/

yaml
Copy code

---

## 🔥 How It Works

1️⃣ Drop `.hl7` files into the **Mirth inbound directory**  
2️⃣ Mirth parses the HL7 message and extracts patient visit data  
3️⃣ Mirth converts the message into **JSON** and POSTs it to the Node backend  
4️⃣ React UI fetches data from `/api/patient-visits`  
5️⃣ Dashboard updates **automatically** 🎉

---

## 📊 Dashboard Features

✔ Patient Table  
✔ Gender Distribution Chart  
✔ Admission Trend Chart  
✔ Visit Number tracking from **PV1 Segment**

---

## 📁 Sample HL7 Files

Ready-to-use messages are available at:

samples/hl7/

yaml
Copy code

Drop them into your Mirth Connect input folder and watch the data appear on the dashboard.

---

## ▶️ Run Instructions

### Start Backend

```bash
cd hl7-dashboard-backend
node server.js
Start Frontend
bash
Copy code
cd hl7-dashboard
npm run dev
Access URLs
Component	URL
Dashboard UI	http://localhost:5173
Patient API	http://localhost:3000/api/patient-visits

🖼️ Screenshots
📌 Mirth Channel Setup
📌 API Response JSON View
📌 HL7 React Dashboard

(Place actual images inside /screenshots/)

🌐 Real-World Use Cases
✔ Hospital Admission Dashboard
✔ Patient Visit Analytics
✔ HL7 → Modern JSON Pipelines
✔ Healthcare System Integration Learning Project

⭐ Contribute / Fork
Want to extend the project? Ideas:

Add PostgreSQL for data persistence

Add FHIR output support

Add real-time socket updates via MQTT

🏁 Summary
This project transforms legacy HL7 messages into modern analytics — a valuable hands-on skill for anyone entering Healthcare IT and HL7 Integration.

🔗 Author
Vicky Kumar Singh
