import { getTaxDashboardStats } from "@/services/Tax"
import { useQuery } from "@tanstack/react-query"

const useAdminDashboardStats = () => {
  return useQuery({
    queryKey: ["dashboard-data"],
    queryFn: getTaxDashboardStats,
  })
}

export default useAdminDashboardStats
