import { fetchUserPayments } from "@/services/Tax"
import { useQuery } from "@tanstack/react-query"

const useUserPayments = () => {
  return useQuery({
    queryKey: ["taxpayer-payment"],
    queryFn: fetchUserPayments,
  })
}

export default useUserPayments
