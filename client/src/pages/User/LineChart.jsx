import { useState } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts"

const monthlyTaxData = [
  { month: "Jan", tax: 400 },
  { month: "Feb", tax: 300 },
  { month: "Mar", tax: 500 },
  { month: "Apr", tax: 200 },
  { month: "May", tax: 350 },
  { month: "Jun", tax: 600 },
  { month: "Jul", tax: 450 },
  { month: "Aug", tax: 380 },
]

export default function TaxBarChart() {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <div className="w-full h-[400px] bg-white rounded-2xl shadow p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Monthly Tax Paid
      </h2>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart
          data={monthlyTaxData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          onMouseLeave={() => setActiveIndex(null)}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="month"
            tick={{ fill: "#6b7280", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#6b7280", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              borderRadius: "8px",
              border: "1px solid #e5e7eb",
            }}
            labelStyle={{ color: "#374151" }}
            itemStyle={{ color: "#111827" }}
          />
          <Bar
            dataKey="tax"
            radius={[8, 8, 0, 0]}
            barSize={38}
            onMouseEnter={(_, index) => setActiveIndex(index)}
            fill="#b1c8f9"
          >
            {monthlyTaxData.map((entry, index) => (
              <cell
                key={`cell-${index}`}
                fill={index === activeIndex ? "#60a5fa" : "#d1d5db"} // hover blue-400, default gray-300
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
