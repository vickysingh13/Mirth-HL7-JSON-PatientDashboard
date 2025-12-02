const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Enable CORS
app.use(cors());

// Parse JSON body
app.use(express.json());

const patientVisits = [];

app.post('/api/patient-visits', (req, res) => {
    patientVisits.push(req.body);
    res.status(201).json({ message: 'Patient visit stored successfully' });
});

app.get('/api/patient-visits', (req, res) => {
    res.json(patientVisits);
});

app.listen(PORT, () => {
    console.log(`HL7 Dashboard Backend running on http://localhost:${PORT}`);
});
