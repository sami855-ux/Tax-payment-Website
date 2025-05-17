import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { useEffect } from "react"
import toast from "react-hot-toast"

const ProtectedRoutes = ({ role = "taxpayer", children }) => {
  const { isAuthenticated, user } = useSelector((store) => store.user)
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) return // wait until user is available

    console.log("Effect triggered: Checking authentication and role")
    console.log(`isAuthenticated: ${isAuthenticated}`)
    console.log(`User role: ${user.role}, Required role: ${role}`)

    if (!isAuthenticated || role !== user.role) {
      console.log(
        "User is not authenticated or role mismatch, navigating to home"
      )
      toast.error("User is not Authenticated, Please log in first")
      navigate("/")
    }
  }, [isAuthenticated, role, user, navigate])

  return <>{children}</>
}

export default ProtectedRoutes
