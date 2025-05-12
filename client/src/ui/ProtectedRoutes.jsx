import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { useEffect } from "react"
import toast from "react-hot-toast"

const ProtectedRoutes = ({ role = "taxpayer", children }) => {
  const { isAuthenticated, user } = useSelector((store) => store.user)
  const navigate = useNavigate()

  //! If the user is not authenticate go back to home page
  useEffect(() => {
    if (!isAuthenticated && role !== user?.role) {
      toast.error("User is not Authenticated")
      navigate("/")
    }
    //eslint-disable-next-line
  }, [])

  return <>{children}</>
}

export default ProtectedRoutes
