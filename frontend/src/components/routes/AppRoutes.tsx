import Dashboard from "@/pages/Dashboard";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import { createBrowserRouter } from "react-router-dom";
import AuthGuard from "../AuthGuard";
import Layout from "../Layout";
import Issue from "@/pages/Issue"
import LostFound from "@/pages/LostFound";
import MyIssues from "@/pages/MyIssues";
import Profile from "@/pages/Profile";
import Notification from "@/pages/Notification";
const AppRoutes = createBrowserRouter([
  {
    path: "/signIn",
    element: <Login />,
  },
  {
    path: "/signUp",
    element: <Register />,
  },
  {
    path: "/",
    element: (
      <AuthGuard>
        <Layout />
      </AuthGuard>
    ),
    children: [
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "issues",
        element: <Issue />,
      },
      {
        path: "lost-found",
        element: <LostFound />,
      },
      {
        path: "my-issues",
        element: <MyIssues />,
      },
      {
        path: "notifications",
        element: <Notification />,
      },
      {
        path: "my-profile",
        element: <Profile />,
      },
    
    ],
  },
]);

export default AppRoutes;
