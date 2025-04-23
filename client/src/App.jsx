import { createBrowserRouter, RouterProvider } from "react-router-dom"

import Welcome from "@/pages/Welcome"
import Login from "@/pages/Login"
import Register, { action as registerAction } from "@/pages/Register"
import AdminLayout from "@/pages/Admin/AdminLayout"
import Dashboard from "@/pages/Admin/Dashboard"
import Error from "@/ui/Error"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Welcome />,
    errorElement: <Error />,
  },
  {
    path: "/login",
    element: <Login />,
    errorElement: <Error />,
  },
  {
    path: "/register",
    element: <Register />,
    action: registerAction,
    errorElement: <Error />,
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
