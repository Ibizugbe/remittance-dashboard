import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import SendMoney from "./pages/SendMoney/SendMoney";
import Transactions from "./pages/Transactions";
import Success from "./pages/Success";
import { ProtectedRoute } from "./components/ProtectedRoute";

export const router = createBrowserRouter([
  { path: "/login", element: <Login /> },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: "send", element: <SendMoney /> },
      { path: "transactions", element: <Transactions /> },
      { path: "success/:id", element: <Success /> },
    ],
  },
]);
