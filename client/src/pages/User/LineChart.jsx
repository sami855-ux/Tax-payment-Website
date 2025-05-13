import { getTaxPaymentTrends } from "@/services/Tax"
import { useQuery } from "@tanstack/react-query"
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

export default function TaxBarChart() {
  const { data, isLoading } = useQuery({
    queryKey: ["payment-trend"],
    queryFn: getTaxPaymentTrends,
  })
  console.log(data)
  const [activeIndex, setActiveIndex] = useState(null)

  // Transform API data to match chart format
  const chartData =
    data?.labels.map((label, index) => ({
      month: label, // "2023-01" becomes the label
      tax: data.datasets[0].data[index], // Total tax paid
      count: data.datasets[1].data[index], // Payment count
    })) || []

  // Format month labels to short names (Jan, Feb, etc.)
  const formatMonth = (dateString) => {
    const date = new Date(dateString + "-01") // Add day to make valid date
    return date.toLocaleString("default", { month: "short" })
  }

  if (isLoading) {
    return (
      <div className="w-full h-[400px] bg-white rounded-2xl shadow p-6 flex items-center justify-center">
        <p>Loading tax data...</p>
      </div>
    )
  }

  return (
    <div className="w-full h-[400px] bg-white rounded-2xl shadow p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Monthly Tax Paid
      </h2>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          onMouseLeave={() => setActiveIndex(null)}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="month"
            tickFormatter={formatMonth}
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
            formatter={(value, name) => [
              name === "tax" ? `$${value.toLocaleString()}` : value,
              name === "tax" ? "Total Paid" : "Payment Count",
            ]}
            labelFormatter={(label) => {
              const date = new Date(label + "-01")
              return date.toLocaleString("default", {
                month: "long",
                year: "numeric",
              })
            }}
          />
          <Bar
            dataKey="tax"
            name="Total Tax Paid"
            radius={[8, 8, 0, 0]}
            barSize={38}
            onMouseEnter={(_, index) => setActiveIndex(index)}
          >
            {chartData.map((_, index) => (
              <cell
                key={`cell-${index}`}
                fill={index === activeIndex ? "#60a5fa" : "#b1c8f9"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
