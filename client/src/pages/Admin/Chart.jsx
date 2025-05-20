import React from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { BarChart, Bar, Cell } from "recharts"
import { PieChart, Pie, Cell as PieCell } from "recharts"
//eslint-disable-next-line
import { motion } from "framer-motion"
import useAdminDashboardStats from "@/context/useAdminDashbaordStats"
import Spinner from "@/ui/Spinner"

const TaxRevenueData = [
  { month: "Jan", revenue: 5000 },
  { month: "Feb", revenue: 5500 },
  { month: "Mar", revenue: 6000 },
  { month: "Apr", revenue: 6500 },
  { month: "May", revenue: 7000 },
  { month: "Jun", revenue: 8000 },
  { month: "Jul", revenue: 8500 },
  { month: "Aug", revenue: 9000 },
  { month: "Sep", revenue: 9500 },
  { month: "Oct", revenue: 10000 },
  { month: "Nov", revenue: 11000 },
  { month: "Dec", revenue: 12000 },
]

const ChartCard = ({ title, children }) => (
  <motion.div
    className="rounded-xl shadow-lg p-6 bg-white"
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <h3 className="text-lg font-semibold mb-4 text-gray-800">{title}</h3>
    {children}
  </motion.div>
)

export default function DashboardCharts() {
  const { data, isLoading } = useAdminDashboardStats()

  if (isLoading) return <Spinner />

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-8">
      {/* Line Chart: Tax Revenue Collected per Month */}
      <ChartCard title="Tax Revenue Collected per Month">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data.TaxRevenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#FF6384"
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Bar Chart: Payments by Tax Type */}
      <ChartCard title="Payments by Tax Type">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.PaymentsByTaxTypeData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="taxType" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="payment" fill="#FF6384">
              {data.PaymentsByTaxTypeData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={index % 2 === 0 ? "#36A2EB" : "#FFCE56"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Pie Chart: User Filing Status */}
      <ChartCard title="User Filing Status">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data.UserFilingStatusData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#FF6384"
            >
              {data.UserFilingStatusData &&
              data.UserFilingStatusData.length > 0 ? (
                data.UserFilingStatusData.map((entry, index) => (
                  <PieCell
                    key={`cell-${index}`}
                    fill={
                      index === 0
                        ? "#4caf50"
                        : index === 1
                        ? "#ff9800"
                        : "#f44336"
                    }
                  />
                ))
              ) : (
                <p className="text-center ">No data available</p>
              )}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  )
}
