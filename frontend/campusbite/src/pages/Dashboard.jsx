import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Dashboard() {
  const { user } = useContext(AuthContext);
  const name = user?.user?.name || user?.name || "Shopper";
  const role = user?.user?.role || user?.role || "buyer";

  return (
    <div>
      <div className="mb-8 rounded-3xl border border-stone-300 bg-[#fbfaf7] p-6 shadow-sm sm:p-8">
        <h1 className="text-3xl font-bold text-stone-950 mb-4 sm:text-4xl">
          {role === "vendor" ? "Vendor Dashboard" : "Shopper Dashboard"}
        </h1>
        <p className="text-gray-700 text-lg">
          Welcome back, <span className="font-semibold text-amber-700">{name}</span>.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Link
          to="/orders"
          className="rounded-3xl border border-stone-300 bg-[#fbfaf7] p-6 shadow-sm transition hover:border-amber-300 hover:shadow-md"
        >
          <h2 className="text-2xl font-bold text-stone-950 mb-2">My Orders</h2>
          <p className="text-gray-700">View and track your past purchases.</p>
        </Link>

        <Link
          to="/cart"
          className="rounded-3xl border border-stone-300 bg-[#fbfaf7] p-6 shadow-sm transition hover:border-amber-300 hover:shadow-md"
        >
          <h2 className="text-2xl font-bold text-stone-950 mb-2">My Cart</h2>
          <p className="text-gray-700">Continue shopping and complete your checkout.</p>
        </Link>
      </div>
    </div>
  );
}

export default Dashboard;
