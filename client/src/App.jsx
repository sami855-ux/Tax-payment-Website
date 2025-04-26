import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { Toaster } from "react-hot-toast"

import Register, { action as registerAction } from "@/pages/Register"
import OfficialDashboard from "@/pages/TaxOfficial/OfficialDashboard"
import OfficialLayout from "./pages/TaxOfficial/OfficialLayout"
import Login, { action as loginAction } from "@/pages/Login"
import PaymentHistory from "./pages/User/PaymentHistory"
import AdminLayout from "@/pages/Admin/AdminLayout"
import UserDashboard from "@/pages/User/Dashboard"
import HelpCenter from "./pages/User/HelpCenter"
import TaxFilling from "./pages/User/TaxFilling"
import UserLayout from "@/pages/User/UserLayout"
import Dashboard from "@/pages/Admin/Dashboard"
import Setting from "./pages/User/Setting"
import GlobalStyles from "./GlobalStyles"
import PayTax from "./pages/User/PayTax"
import Welcome from "@/pages/Welcome"
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
    action: loginAction,
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
  {
    path: "/user",
    element: <UserLayout />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        path: "dashboard",
        element: <UserDashboard />,
      },
      {
        path: "help",
        element: <HelpCenter />,
      },
      {
        path: "setting",
        element: <Setting />,
      },
      {
        path: "payTax",
        element: <PayTax />,
      },
      {
        path: "taxFilling",
        element: <TaxFilling />,
      },
      {
        path: "history",
        element: <PaymentHistory />,
      },
    ],
  },
  {
    path: "/official",
    errorElement: <Error />,
    element: <OfficialLayout />,
    children: [
      {
        path: "dashboard",
        index: true,
        element: <OfficialDashboard />,
      },
    ],
  },
])

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
})

export default function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />

        <GlobalStyles />
        <RouterProvider router={router} />

        <Toaster
          position="top-center"
          gutter={12}
          containerStyle={{ margin: "8px" }}
          toastOptions={{
            success: {
              duration: 3000,
            },
            error: {
              duration: 5000,
            },
            style: {
              fontSize: "16px",
              maxWidth: "500px",
              padding: "16px 24px",
            },
          }}
        />
      </QueryClientProvider>
    </>
  )
}
