import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"

const taxCategories = [
  { name: "Income Tax", value: 400 },
  { name: "Property Tax", value: 300 },
  { name: "Business Tax", value: 300 },
]

const COLORS = ["url(#gradient1)", "url(#gradient2)", "url(#gradient3)"]

export default function TaxPieChart() {
  return (
    <div className="w-full h-[380px] bg-gray-100  p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Tax Category Breakdown
      </h2>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          {/* Gradients */}
          <defs>
            <linearGradient id="gradient1" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.7} />
              <stop offset="100%" stopColor="#60a5fa" stopOpacity={1} />
            </linearGradient>
            <linearGradient id="gradient2" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity={0.7} />
              <stop offset="100%" stopColor="#34d399" stopOpacity={1} />
            </linearGradient>
            <linearGradient id="gradient3" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.7} />
              <stop offset="100%" stopColor="#fbbf24" stopOpacity={1} />
            </linearGradient>
          </defs>

          <Pie
            data={taxCategories}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={100}
            innerRadius={40}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) =>
              `${name} (${(percent * 100).toFixed(0)}%)`
            }
          >
            {taxCategories.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              borderRadius: "8px",
              border: "1px solid #e5e7eb",
            }}
            itemStyle={{ color: "#111827" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
