import { createBrowserRouter, RouterProvider } from "react-router-dom"

import Welcome from "./page/Welcome"
import Login from "./page/Login"
import Register from "./page/Register"
import AdminLayout from "./page/Admin/AdminLayout"
import Dashboard from "./page/Admin/Dashboard"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Welcome />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
    ],
  },
])

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}
