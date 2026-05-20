import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Cart from "./pages/Cart";
import VendorDashboard from "./pages/VendorDashboard";
import Orders from "./pages/Orders";
import VendorOrders from "./pages/VendorOrders";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";

import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

function App() {
  const { user, loading } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-[#1c120d] text-white">

      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/dashboard" element={
            <ProtectedRoute user={user} loading={loading}>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/orders" element={<Orders />} />
          <Route path="/vendor-dashboard" element={
            <ProtectedRoute user={user} role="vendor" loading={loading}>
              <VendorDashboard />
            </ProtectedRoute>
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/vendor/orders" element={
            <ProtectedRoute
              user={user}
              role="vendor"
              loading={loading}
            >
              <VendorOrders />
            </ProtectedRoute>
            } />
        </Routes>
      </div>

    </div>
  );
}

export default App;
