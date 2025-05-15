import { fetchOfficialDashboardStats } from "@/services/Tax"
import { useQuery } from "@tanstack/react-query"

const OfficialDashboardData = () => {
  return useQuery({
    queryKey: ["dashboard-data"],
    queryFn: fetchOfficialDashboardStats,
  })
}

export default OfficialDashboardData
