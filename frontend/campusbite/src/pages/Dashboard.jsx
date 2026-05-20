import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Dashboard() {
  const { user } = useContext(AuthContext);
  const name = user?.user?.name || user?.name || "Customer";
  const role = user?.user?.role || user?.role || "buyer";

  return (
    <div>
      <div className="mb-8 rounded-3xl border border-yellow-700 bg-[#2c1b12] p-8">
        <h1 className="text-4xl font-bold text-yellow-500 mb-4">
          {role === "vendor" ? "Vendor Dashboard" : "Buyer Dashboard"}
        </h1>
        <p className="text-gray-300 text-lg">
          Welcome back, <span className="text-yellow-400">{name}</span>.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Link
          to="/orders"
          className="rounded-3xl border border-yellow-700 bg-[#120b08] p-6 hover:border-yellow-500 transition"
        >
          <h2 className="text-2xl font-bold text-yellow-500 mb-2">My Orders</h2>
          <p className="text-gray-300">View and track your past purchases.</p>
        </Link>

        <Link
          to="/cart"
          className="rounded-3xl border border-yellow-700 bg-[#120b08] p-6 hover:border-yellow-500 transition"
        >
          <h2 className="text-2xl font-bold text-yellow-500 mb-2">My Cart</h2>
          <p className="text-gray-300">Continue shopping and complete your checkout.</p>
        </Link>
      </div>
    </div>
  );
}

export default Dashboard;
