import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import {
  createBrowserRouter,
  redirect,
  RouterProvider,
  useNavigate,
} from "react-router-dom"
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
import PayTax from "./pages/User/PayTax"
import Welcome from "@/pages/Welcome"
import Error from "@/ui/Error"
import ManageUser from "./pages/Admin/ManageUser"
import ManageTax from "./pages/Admin/ManageTax"
import Payment from "./pages/Admin/Payment"
import Settings from "./pages/Admin/Settings"
import Report from "@/pages/Admin/Report"
import Profile from "./pages/Admin/Profile"
import Taxpayer from "./pages/TaxOfficial/Taxpayer"
import Notification from "./pages/TaxOfficial/Notification"
import NotificationUser from "./pages/User/NotificationUser"
import NotificationAdmin from "./pages/Admin/NotificationAdmin"
import VerifyTaxFilling from "@/pages/TaxOfficial/VerifyTaxFilling"
import OfficialPayments from "./pages/TaxOfficial/OfficialPayments"
import OfficialSettings from "./pages/TaxOfficial/OfficialSettings"
import OfficialReport from "./pages/TaxOfficial/OfficialReport"
import ProtectedRoutes from "./ui/ProtectedRoutes"
import Maintenance from "./pages/Admin/Maintenance"
import PaymentLog from "./pages/Admin/PaymentLog"
import TaxSetupWizard from "./pages/User/CompleteTax"
import Reset from "./pages/Reset"
import axios from "axios"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { login, logout } from "./redux/slice/userSlice"

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
    path: "/reset",
    element: <Reset />,
    errorElement: <Error />,
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoutes role="admin">
        <AdminLayout />
      </ProtectedRoutes>
    ),
    errorElement: <Error />,
    children: [
      {
        index: true,
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "manage-users",
        element: <ManageUser />,
      },
      {
        path: "manage-tax",
        element: <ManageTax />,
      },

      {
        path: "payment",
        element: <Payment />,
      },

      {
        path: "setting",
        element: <Settings />,
      },
      {
        path: "report",
        element: <Report />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "notification",
        element: <NotificationAdmin />,
      },
      {
        path: "maintenance",
        element: <Maintenance />,
      },
      {
        path: "payment-log",
        element: <PaymentLog />,
      },
    ],
  },
  {
    path: "/user",
    element: (
      <ProtectedRoutes>
        <UserLayout role="taxpayer" />
      </ProtectedRoutes>
    ),
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
      {
        path: "notification",
        element: <NotificationUser />,
      },
      {
        path: "complete-tax-setup",
        element: <TaxSetupWizard />,
      },
    ],
  },
  {
    path: "/official",
    errorElement: <Error />,
    element: (
      <ProtectedRoutes role="official">
        <OfficialLayout />
      </ProtectedRoutes>
    ),
    children: [
      {
        path: "dashboard",
        index: true,
        element: <OfficialDashboard />,
      },
      {
        path: "taxpayer",
        element: <Taxpayer />,
      },
      {
        path: "notification",
        element: <Notification />,
      },
      {
        path: "taxFilling",
        element: <VerifyTaxFilling />,
      },
      {
        path: "payments",
        element: <OfficialPayments />,
      },
      {
        path: "settings",
        element: <OfficialSettings />,
      },
      {
        path: "report",
        element: <OfficialReport />,
      },
    ],
  },
])

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchInterval: 1000 * 60,
      refetchIntervalInBackground: true,
    },
  },
})

export default function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />

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
              fontSize: "15px",
              maxWidth: "600px",
              padding: "14px 24px",
              fontFamily: "Inter",
            },
          }}
        />
      </QueryClientProvider>
    </>
  )
}
