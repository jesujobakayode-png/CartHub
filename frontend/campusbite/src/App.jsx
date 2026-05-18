import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import VendorDashboard from "./pages/VendorDashboard";
import Orders from "./pages/Orders";

function App() {
  return (
    <div className="min-h-screen bg-[#1c120d] text-white">

      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/vendor-dashboard" element={<VendorDashboard />} />
        </Routes>
      </div>

    </div>
  );
}

export default App;
