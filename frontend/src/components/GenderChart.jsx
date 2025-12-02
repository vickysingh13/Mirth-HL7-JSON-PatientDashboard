import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";

export default function GenderChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    const res = await fetch("http://localhost:3000/api/patient-visits");
    const visits = await res.json();

    const male = visits.filter(v => v.gender === "M").length;
    const female = visits.filter(v => v.gender === "F").length;

    setData([
      { name: "Male", value: male },
      { name: "Female", value: female }
    ]);
  };

  return (
    <div className="bg-white p-4 rounded shadow mt-6">
      <h2 className="text-xl font-bold mb-2 text-blue-700">Gender Distribution</h2>
      <PieChart width={400} height={300}>
        <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100}>
          <Cell fill="#3b82f6" />
          <Cell fill="#ef4444" />
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
}
