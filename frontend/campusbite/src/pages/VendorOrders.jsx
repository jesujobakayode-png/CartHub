import { useContext, useEffect, useState } from "react";

import API from "../services/api";
import { onEvent, offEvent } from "../utils/socket";
import { AuthContext } from "../context/AuthContext";
import { ToastContext } from "../context/ToastContext";

const statusStyles = {
  pending: "bg-amber-100 text-amber-700 border-amber-200",
  preparing: "bg-blue-100 text-blue-700 border-blue-200",
  "out-for-delivery": "bg-violet-100 text-violet-700 border-violet-200",
  delivered: "bg-emerald-100 text-emerald-700 border-emerald-200",
  cancelled: "bg-red-100 text-red-700 border-red-200",
};

const orderClasses = [
  { key: "all", label: "All", statuses: [] },
  { key: "pending", label: "Pending", statuses: ["pending"] },
  { key: "in-progress", label: "In Progress", statuses: ["preparing", "out-for-delivery"] },
  { key: "completed", label: "Completed", statuses: ["delivered"] },
  { key: "cancelled", label: "Cancelled", statuses: ["cancelled"] },
];

function getVendorItems(order, userId) {
  const items = Array.isArray(order.items) ? order.items : [];

  if (!userId) {
    return [];
  }

  return items.filter((item) => {
    const vendorId = typeof item.vendor === "string" ? item.vendor : item.vendor?._id;
    return vendorId === userId;
  });
}

function getOrderStatus(order) {
  return order.vendorStatus || order.items?.[0]?.status || order.status || "pending";
}

function getCurrentUserId(user) {
  return user?.id || user?._id || user?.user?.id || user?.user?._id;
}

function orderMatchesSearch(order, vendorItems, searchTerm) {
  const needle = searchTerm.trim().toLowerCase();

  if (!needle) {
    return true;
  }

  const searchable = [
    order._id,
    getOrderStatus(order),
    order.user?.name,
    order.user?.email,
    ...vendorItems.map((item) => item.name),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return searchable.includes(needle);
}

function VendorOrders() {
  const { user } = useContext(AuthContext);
  const { showToast } = useContext(ToastContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderClass, setOrderClass] = useState("all");
  const [orderSearch, setOrderSearch] = useState("");
  const [submittedOrderSearch, setSubmittedOrderSearch] = useState("");
  const currentUserId = getCurrentUserId(user);

  const fetchOrders = async () => {
    try {
      const res = await API.get("/orders");
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

  useEffect(() => {
    const handleNew = (order) => {
      setOrders((prev) => [order, ...prev.filter((item) => item._id !== order._id)]);
      if (showToast) showToast({ message: "New order received", type: "success" });
    };

    const handleUpdate = (updatedOrder) => {
      setOrders((prev) =>
        prev.map((order) => (order._id === updatedOrder._id ? updatedOrder : order))
      );
      if (showToast) {
        showToast({ message: `Order ${updatedOrder._id.slice(-6)} updated`, type: "info" });
      }
    };

    onEvent("newOrder", handleNew);
    onEvent("orderUpdated", handleUpdate);

    return () => {
      offEvent("newOrder", handleNew);
      offEvent("orderUpdated", handleUpdate);
    };
  }, [showToast]);

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/orders/${id}`, { status });
      fetchOrders();
    } catch (error) {
      console.log(error);
    }
  };

  const activeOrderClass = orderClasses.find((item) => item.key === orderClass);
  const visibleOrders = orders.filter((order) => {
    const vendorItems = getVendorItems(order, currentUserId);
    const matchesClass =
      !activeOrderClass?.statuses.length || activeOrderClass.statuses.includes(getOrderStatus(order));

    return matchesClass && orderMatchesSearch(order, vendorItems, submittedOrderSearch);
  });

  if (loading) {
    return (
      <div className="rounded-3xl border border-stone-200 bg-white/80 p-8 text-center text-stone-700 shadow-sm">
        Loading orders...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-stone-300 bg-slate-50 p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-stone-950 sm:text-4xl">Vendor Orders</h1>
            <p className="mt-2 max-w-2xl text-sm text-stone-600">
              Manage incoming shopper orders with full item details and real-time status updates.
            </p>
          </div>
          <div className="rounded-3xl bg-white px-4 py-3 text-sm font-semibold text-stone-700 shadow-sm">
            {orders.length} orders
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-stone-300 bg-white/95 p-4 shadow-sm sm:p-5">
        <div className="flex flex-wrap gap-2">
          {orderClasses.map((item) => {
            const count = item.statuses.length
              ? orders.filter((order) => item.statuses.includes(getOrderStatus(order))).length
              : orders.length;

            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setOrderClass(item.key)}
                className={`rounded-lg border px-3 py-2 text-sm font-semibold transition ${
                  orderClass === item.key
                    ? "border-amber-500 bg-amber-500 text-black"
                    : "border-stone-300 bg-white text-stone-700 hover:border-amber-300 hover:bg-amber-50"
                }`}
              >
                {item.label} ({count})
              </button>
            );
          })}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSubmittedOrderSearch(orderSearch);
          }}
          className="mt-4 flex flex-col gap-3 sm:flex-row"
        >
          <input
            type="search"
            value={orderSearch}
            onChange={(e) => setOrderSearch(e.target.value)}
            placeholder="Search order ID, shopper, email, item, or status"
            className="min-h-11 flex-1 rounded-lg border border-stone-200 bg-slate-50 px-3 py-2 text-sm outline-none transition focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-100"
          />
          <button
            type="submit"
            className="min-h-11 rounded-lg border border-amber-500 bg-amber-500 px-5 py-2 text-sm font-bold text-black transition hover:bg-amber-400"
          >
            Search
          </button>
        </form>
      </section>

      {orders.length === 0 ? (
        <div className="rounded-3xl border border-stone-300 bg-slate-50 p-8 text-center text-stone-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <p className="text-xl font-semibold text-stone-950">No orders yet</p>
          <p className="mt-2 text-sm text-stone-600">Incoming shopper orders will appear here.</p>
        </div>
      ) : visibleOrders.length === 0 ? (
        <div className="rounded-3xl border border-stone-300 bg-slate-50 p-8 text-center text-stone-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <p className="text-xl font-semibold text-stone-950">No matching orders</p>
          <p className="mt-2 text-sm text-stone-600">Try another class or search term.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {visibleOrders.map((order) => {
            const vendorItems = getVendorItems(order, currentUserId);
            const orderStatus = getOrderStatus(order);
            const sellerTotal = vendorItems.reduce(
              (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0),
              0
            );
            const sellerQuantity = vendorItems.reduce(
              (sum, item) => sum + Number(item.quantity || 0),
              0
            );

            return (
              <div
                key={order._id}
                className="rounded-4xl border border-stone-200 bg-white/95 p-6 shadow-sm ring-1 ring-stone-100 sm:p-8 transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="mb-6 border-b border-stone-200 pb-6">
                  <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-3">
                        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-600">
                          Order #{order._id.slice(-6)}
                        </p>
                        <span className="text-sm text-stone-500">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <select
                        value={orderStatus}
                        onChange={(e) => updateStatus(order._id, e.target.value)}
                        className={`rounded-full border-2 px-4 py-2 text-sm font-semibold capitalize transition ${
                          statusStyles[orderStatus] || "border-stone-200 bg-stone-50"
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="preparing">Preparing</option>
                        <option value="out-for-delivery">Out For Delivery</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                    <div className="rounded-3xl bg-slate-50 px-4 py-3 text-lg font-bold text-stone-950 shadow-inner shadow-stone-100">
                      NGN {sellerTotal}
                    </div>
                  </div>
                </div>

                <div className="mb-6 rounded-3xl border border-stone-200 bg-slate-50 p-4">
                  <p className="mb-2 text-sm font-semibold text-stone-700">SHOPPER</p>
                  <p className="text-base font-semibold text-stone-950">
                    {order.user?.name || "Shopper"}
                  </p>
                  <p className="text-sm text-stone-600">{order.user?.email || "No email"}</p>
                </div>

                <div className="mb-6">
                  <p className="mb-4 text-sm font-semibold uppercase text-stone-700">
                    Seller Items ({vendorItems.length})
                  </p>
                  <div className="space-y-4">
                    {vendorItems.map((item, index) => (
                      <div
                        key={`${item.productId || item.name}-${index}`}
                        className="rounded-3xl border-2 border-stone-200 bg-slate-50 p-4 transition hover:border-amber-300 hover:shadow-sm"
                      >
                        <div className="sm:flex sm:items-center sm:justify-between sm:gap-4">
                          <div className="flex min-w-0 flex-1 items-center gap-3">
                            {item.image && (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="h-16 w-16 rounded-xl border border-stone-200 object-cover"
                              />
                            )}
                            <div className="min-w-0">
                              <p className="text-base font-semibold text-stone-950">{item.name}</p>
                              <p className="text-sm text-stone-600">
                                Qty {item.quantity} x NGN {item.price} each
                              </p>
                            </div>
                          </div>
                          <p className="mt-3 text-sm font-semibold text-stone-950 sm:mt-0">
                            NGN {Number(item.price || 0) * Number(item.quantity || 0)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-3xl border border-stone-200 bg-slate-50 p-4">
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <div>
                      <p className="text-xs font-semibold uppercase text-stone-700">Total Items</p>
                      <p className="mt-1 text-lg font-bold text-stone-950">{sellerQuantity}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase text-stone-700">Seller Total</p>
                      <p className="mt-1 text-lg font-bold text-amber-700">NGN {sellerTotal}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase text-stone-700">Status</p>
                      <p className="mt-1 text-sm font-semibold capitalize text-stone-950">
                        {orderStatus.replaceAll("-", " ")}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase text-stone-700">Placed</p>
                      <p className="mt-1 text-xs text-stone-600">
                        {new Date(order.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 border-t border-stone-200 pt-4">
                    <p className="text-xs font-semibold uppercase text-stone-700">
                      Full Order Total
                    </p>
                    <p className="mt-1 text-sm font-semibold text-stone-950">
                      NGN {order.totalPrice}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default VendorOrders;
