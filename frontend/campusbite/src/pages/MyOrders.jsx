import { useEffect, useState } from "react";
import { onEvent, offEvent } from "../utils/socket";

import API from "../services/api";

const statusSteps = ["pending", "preparing", "out-for-delivery", "delivered"];

const statusStyles = {
  pending: "bg-amber-500 text-black",
  preparing: "bg-blue-500 text-white",
  "out-for-delivery": "bg-purple-500 text-white",
  delivered: "bg-green-500 text-black",
  cancelled: "bg-red-500 text-white",
};

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await API.get("/orders/my-orders");
      setOrders(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.log(error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();

    const handleUpdate = (updatedOrder) => {
      setOrders((prev) =>
        prev.map((o) => (o._id === updatedOrder._id ? updatedOrder : o))
      );
    };

    onEvent("orderUpdated", handleUpdate);
    const handleCreate = (newOrder) => setOrders((prev) => [newOrder, ...prev]);
    onEvent("orderCreated", handleCreate);

    return () => {
      offEvent("orderUpdated", handleUpdate);
      offEvent("orderCreated", handleCreate);
    };
  }, []);

  const isStepComplete = (orderStatus, step) => {
    if (orderStatus === "cancelled") {
      return false;
    }

    return statusSteps.indexOf(orderStatus) >= statusSteps.indexOf(step);
  };

  return (
    <div>
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-stone-950 mb-3 sm:text-4xl">
          My Orders
        </h1>

        <p className="text-gray-700">Track your recent orders</p>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <p className="text-amber-600 text-xl">Loading orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-[#fbfaf7] border border-stone-300 rounded-3xl p-8 text-center shadow-sm sm:p-12">
          <div className="text-5xl mb-6 font-bold text-amber-700">
            Orders
          </div>

          <h2 className="text-3xl font-bold text-stone-950 mb-3">
            No Orders Yet
          </h2>

          <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
            Once you place an order, you will be able to track it here in real
            time.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-[#fbfaf7] border border-stone-300 rounded-2xl p-4 shadow-sm sm:p-6 transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-bold text-stone-950">
                    Order #{order._id.slice(-6)}
                  </h2>

                  <p className="text-gray-600 text-sm mt-1">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>

                <span
                  className={`px-4 py-2 rounded-full font-semibold text-sm capitalize ${
                    statusStyles[order.status] || "bg-gray-200 text-gray-900"
                  }`}
                >
                  {order.status?.replaceAll("-", " ") || "pending"}
                </span>
              </div>

              <div className="space-y-4 mb-6">
                {order.items.map((item, index) => (
                  <div
                    key={`${item.name}-${index}`}
                    className="flex items-center gap-4 bg-stone-50 rounded-xl p-3 border border-stone-200 transition hover:-translate-y-0.5 hover:border-amber-300 hover:shadow-sm sm:p-4"
                  >
                    <img
                      src={item.image || "https://via.placeholder.com/120"}
                      alt={item.name}
                      className="w-16 h-16 rounded-lg border border-stone-100 object-cover sm:h-20 sm:w-20"
                    />

                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-stone-950 truncate">
                        {item.name}
                      </h3>

                      <p className="text-gray-600">Qty: {item.quantity}</p>
                    </div>

                    <p className="font-bold whitespace-nowrap">
                      NGN {Number(item.price || 0) * Number(item.quantity || 0)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-stone-200 pt-4 flex justify-between items-center">
                <h3 className="text-xl font-bold text-stone-950">Total</h3>

                <p className="text-2xl font-bold">NGN {order.totalPrice}</p>
              </div>

              <div className="mt-6">
                <div className="grid grid-cols-4 gap-2">
                  {statusSteps.map((step, index) => (
                    <div key={step} className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                          isStepComplete(order.status, step)
                            ? "bg-amber-500 text-black"
                            : "bg-gray-200 text-gray-900"
                        }`}
                      >
                        {index + 1}
                      </div>

                      <p className="text-xs sm:text-sm mt-2 text-center capitalize text-stone-600">
                        {step.replaceAll("-", " ")}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyOrders;
