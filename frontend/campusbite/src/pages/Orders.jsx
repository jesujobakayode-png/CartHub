import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import BackButton from "../components/BackButton";
import API from "../services/api";
import { onEvent, offEvent } from "../utils/socket";

const statusStyles = {
  pending: "bg-amber-100 text-amber-700",
  preparing: "bg-blue-100 text-blue-700",
  "out-for-delivery": "bg-violet-100 text-violet-700",
  delivered: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-red-100 text-red-700",
};

function getOrderItemValue(item, field) {
  return item[field] ?? item.productId?.[field];
}

function getOrderItemVendor(item) {
  return item.vendor || item.productId?.vendor;
}

function getOrderItemVendorId(item) {
  const vendor = getOrderItemVendor(item);
  return item.vendorId || (typeof vendor === "string" ? vendor : vendor?._id || vendor?.id);
}

function getOrderItemVendorName(item) {
  const vendor = getOrderItemVendor(item);
  return typeof vendor === "string" ? "Vendor" : vendor?.brandName || vendor?.name || "Vendor";
}

function Orders() {
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

    const handleCreate = (newOrder) => {
      setOrders((prev) => [newOrder, ...prev.filter((order) => order._id !== newOrder._id)]);
    };

    const handleUpdate = (updatedOrder) => {
      setOrders((prev) =>
        prev.map((order) => (order._id === updatedOrder._id ? updatedOrder : order))
      );
    };

    onEvent("orderCreated", handleCreate);
    onEvent("orderUpdated", handleUpdate);

    return () => {
      offEvent("orderCreated", handleCreate);
      offEvent("orderUpdated", handleUpdate);
    };
  }, []);

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-stone-300 bg-slate-50 p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-4">
              <BackButton />
            </div>
            <h1 className="text-3xl font-bold text-stone-950 sm:text-4xl">Orders</h1>
            <p className="mt-2 max-w-2xl text-sm text-stone-600">
              Review your latest purchases with clear status labels, order totals, and item summaries.
            </p>
          </div>
          <div className="rounded-3xl bg-white px-4 py-3 text-sm font-semibold text-stone-700 shadow-sm">
            {orders.length} orders found
          </div>
        </div>
      </section>

      {loading ? (
        <div className="rounded-3xl border border-stone-200 bg-white/80 p-8 text-center text-stone-700 shadow-sm">
          Loading your orders...
        </div>
      ) : orders.length === 0 ? (
        <div className="rounded-3xl border border-stone-300 bg-slate-50 p-8 text-center text-stone-700 shadow-sm">
          <p className="text-xl font-semibold text-stone-950">No orders yet</p>
          <p className="mt-2 text-sm text-stone-600">Your completed orders will appear here once they're placed.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="rounded-4xl border border-stone-200 bg-white/95 p-6 shadow-sm ring-1 ring-stone-100 transition hover:-translate-y-0.5 hover:shadow-md sm:p-8"
            >
              <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-600">
                      Order #{order._id.slice(-6)}
                    </p>
                    <span className="text-sm text-stone-500">{new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center rounded-full border border-stone-200 bg-white px-3 py-1 text-sm font-semibold text-stone-900 shadow-sm">
                      Status:
                      <span className={`ml-2 inline-flex rounded-full px-3 py-1 text-sm font-semibold ${statusStyles[order.status] || "bg-stone-100 text-stone-700"}`}>
                        {order.status?.replaceAll("-", " ") || "pending"}
                      </span>
                    </span>
                    <p className="text-sm text-stone-500">
                      {order.items.length} item{order.items.length === 1 ? "" : "s"}
                    </p>
                  </div>
                </div>
                <div className="rounded-3xl bg-slate-50 px-4 py-3 text-lg font-bold text-stone-950 shadow-inner shadow-stone-100">
                  NGN {order.totalPrice}
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {order.items.map((item, index) => {
                  const itemName = getOrderItemValue(item, "name") || "Product";
                  const itemPrice = Number(getOrderItemValue(item, "price") || 0);
                  const itemQuantity = Number(item.quantity || 0);
                  const vendorId = getOrderItemVendorId(item);
                  const vendorName = getOrderItemVendorName(item);

                  return (
                    <div
                      key={`${item.productId?._id || item.productId || itemName}-${index}`}
                      className="rounded-3xl border-2 border-stone-200 bg-slate-50 p-4 shadow-sm transition hover:border-amber-300 sm:flex sm:items-center sm:justify-between"
                    >
                      <div className="min-w-0">
                        <p className="text-base font-semibold text-stone-950">{itemName}</p>
                        <p className="text-sm text-stone-600">
                          Qty {item.quantity} - NGN {itemPrice} each
                        </p>
                        {vendorId && (
                          <Link
                            to={`/vendor/${vendorId}`}
                            className="mt-2 inline-flex text-sm font-semibold text-amber-700 hover:text-amber-600"
                          >
                            Sold by {vendorName}
                          </Link>
                        )}
                      </div>
                      <p className="mt-3 text-sm font-semibold text-stone-950 sm:mt-0">
                        NGN {itemPrice * itemQuantity}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 space-y-4 rounded-3xl border border-stone-200 bg-slate-50 p-4">
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  <div>
                    <p className="text-xs font-semibold uppercase text-stone-700">Estimated Delivery</p>
                    <p className="mt-1 text-sm font-semibold text-stone-950">
                      {order.status === "delivered" ? "Delivered" : order.status === "cancelled" ? "Cancelled" : "2-3 days"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase text-stone-700">Order Status</p>
                    <p className="mt-1 text-sm font-semibold capitalize text-stone-950">
                      {order.status?.replaceAll("-", " ")}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase text-stone-700">Total Items</p>
                    <p className="mt-1 text-sm font-semibold text-stone-950">
                      {order.items.reduce((sum, it) => sum + Number(it.quantity || 0), 0)}
                    </p>
                  </div>
                </div>
                {order.items.length > 0 && getOrderItemVendor(order.items[0]) && (
                  <div className="border-t border-stone-200 pt-4">
                    <p className="text-xs font-semibold uppercase text-stone-700">Seller Contact</p>
                    <p className="mt-1 text-sm text-stone-900">
                      {typeof getOrderItemVendor(order.items[0]) === "string"
                        ? "Vendor"
                        : getOrderItemVendor(order.items[0])?.name || "Vendor"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Orders;
