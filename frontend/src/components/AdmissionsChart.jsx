import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

export default function AdmissionsChart() {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    const res = await fetch("http://localhost:3000/api/patient-visits");
    const visits = await res.json();

    const grouped = {};

    visits.forEach(v => {
      const date = v.admit_datetime?.split(" ")[0]; // YYYY-MM-DD only
      if (!grouped[date]) grouped[date] = 0;
      grouped[date]++;
    });

    setChartData(Object.entries(grouped).map(([date, count]) => ({
      date,
      count
    })));
  };

  return (
    <div className="bg-white p-4 rounded shadow mt-6">
      <h2 className="text-xl font-bold mb-2 text-blue-700">Admissions Over Time</h2>
      <LineChart width={600} height={300} data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis allowDecimals={false}/>
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="count" stroke="#16a34a" />
      </LineChart>
    </div>
  );
}
