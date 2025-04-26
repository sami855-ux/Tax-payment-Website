import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { useEffect } from "react"

const ProtectedRoutes = ({ children }) => {
  const { isAuthenticated } = useSelector((store) => store.user)
  const navigate = useNavigate()

  //! If the user is not authenticate go back to login page
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login")
    }
    //eslint-disable-next-line
  }, [])

  return <>{children}</>
}

export default ProtectedRoutes
