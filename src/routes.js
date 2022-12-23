import { Navigate, useRoutes } from "react-router-dom";

// layouts

import Layout from "./layouts/dashboard";
import LogoOnlyLayout from "./layouts/LogoOnlyLayout";

import Login from "./pages/Login";
import NotFound from "./pages/Page404";

import Register from "./pages/Register";

import User from "./pages/User";
import NewUser from "./pages/NewUser";
import EditUser from "./pages/EditUser";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: "/",
      element: <Layout />,
      children: [
        { path: "dashboard", element: <Dashboard /> },
        { path: "user", element: <User /> },
        { path: "user/new", element: <NewUser /> },
        { path: "user/edit/:id", element: <EditUser /> },
        { path: "profile", element: <Profile /> },
      ],
    },
    {
      path: "/",
      element: <LogoOnlyLayout />,
      children: [
        { path: "login", element: <Login /> },
        { path: "register", element: <Register /> },
      ],
    },
    { path: "404", element: <NotFound /> },
    { path: "*", element: <Navigate to="/404" replace /> },
  ]);
}
