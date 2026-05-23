import { useEffect, useState } from "react";

import API from "../services/api";

const statusSteps = ["pending", "preparing", "out-for-delivery", "delivered"];

const statusStyles = {
  pending: "bg-yellow-500 text-black",
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
        <h1 className="text-4xl font-bold text-yellow-500 mb-3">
          My Orders
        </h1>

        <p className="text-gray-300">Track your recent orders</p>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <p className="text-yellow-500 text-xl">Loading orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-[#2c1b12] border border-yellow-700 rounded-3xl p-12 text-center shadow-2xl">
          <div className="text-5xl mb-6 font-bold text-yellow-500">
            Orders
          </div>

          <h2 className="text-3xl font-bold text-yellow-500 mb-3">
            No Orders Yet
          </h2>

          <p className="text-gray-400 max-w-md mx-auto leading-relaxed">
            Once you place an order, you will be able to track it here in real
            time.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-[#2c1b12] border border-yellow-700 rounded-2xl p-6 shadow-lg"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-bold text-yellow-500">
                    Order #{order._id.slice(-6)}
                  </h2>

                  <p className="text-gray-400 text-sm mt-1">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>

                <span
                  className={`px-4 py-2 rounded-full font-semibold text-sm capitalize ${
                    statusStyles[order.status] || "bg-gray-600 text-white"
                  }`}
                >
                  {order.status?.replaceAll("-", " ") || "pending"}
                </span>
              </div>

              <div className="space-y-4 mb-6">
                {order.items.map((item, index) => (
                  <div
                    key={`${item.name}-${index}`}
                    className="flex items-center gap-4 bg-[#1c120d] rounded-xl p-4"
                  >
                    <img
                      src={item.image || "https://via.placeholder.com/120"}
                      alt={item.name}
                      className="w-20 h-20 rounded-lg object-cover"
                    />

                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-yellow-500 truncate">
                        {item.name}
                      </h3>

                      <p className="text-gray-400">Qty: {item.quantity}</p>
                    </div>

                    <p className="font-bold whitespace-nowrap">
                      NGN {Number(item.price || 0) * Number(item.quantity || 0)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-yellow-700 pt-4 flex justify-between items-center">
                <h3 className="text-xl font-bold text-yellow-500">Total</h3>

                <p className="text-2xl font-bold">NGN {order.totalPrice}</p>
              </div>

              <div className="mt-6">
                <div className="grid grid-cols-4 gap-2">
                  {statusSteps.map((step, index) => (
                    <div key={step} className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                          isStepComplete(order.status, step)
                            ? "bg-yellow-500 text-black"
                            : "bg-gray-700"
                        }`}
                      >
                        {index + 1}
                      </div>

                      <p className="text-xs sm:text-sm mt-2 text-center capitalize">
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
