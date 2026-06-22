import { useEffect } from "react";
import { useNotification } from "../context/NotificationContext";
import { FaBell, FaCheckCircle, FaInbox } from "react-icons/fa";

function Notifications() {
  const {
    notifications,
    unreadCount,
    markAllAsRead,
    clearNotifications,
  } = useNotification();

  useEffect(() => {
    if (notifications.length > 0) {
      markAllAsRead();
    }
  }, [notifications, markAllAsRead]);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-stone-300 bg-[#fbfaf7] p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3 text-2xl font-bold text-stone-950">
              <FaBell className="text-amber-600" />
              Notifications
            </div>
            <p className="mt-1 text-sm text-stone-600">
              Stay updated on seller and buyer order activity in one place.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={markAllAsRead}
              className="rounded-xl border border-amber-500 bg-amber-500 px-4 py-2 text-sm font-semibold text-black transition hover:bg-amber-400"
            >
              Mark all read
            </button>
            <button
              type="button"
              onClick={clearNotifications}
              className="rounded-xl border border-stone-300 bg-[#fbfaf7] px-4 py-2 text-sm font-semibold text-stone-700 transition hover:border-amber-300 hover:bg-amber-50"
            >
              Clear all
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-stone-300 bg-[#fbfaf7] p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4 border-b border-stone-200 pb-4">
          <div className="flex items-center gap-2 text-stone-900">
            <FaInbox className="text-amber-600" />
            <span className="text-lg font-semibold">Recent Alerts</span>
          </div>
          <span className="rounded-full bg-amber-500 px-3 py-1 text-sm font-semibold text-black">
            {unreadCount} unread
          </span>
        </div>

        {notifications.length === 0 ? (
          <div className="py-20 text-center text-stone-600">
            <FaCheckCircle className="mx-auto mb-4 text-4xl text-amber-500" />
            <p className="text-xl font-semibold">No notifications yet</p>
            <p className="mt-2 text-sm">Order updates will appear here immediately.</p>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`rounded-3xl border p-4 shadow-sm transition duration-200 ${
                  notification.read
                    ? "border-stone-200 bg-white hover:-translate-y-0.5 hover:shadow-md"
                    : "border-amber-400 bg-amber-50 hover:-translate-y-0.5 hover:shadow-md"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-base font-semibold text-stone-950">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-amber-500 text-black">
                        <FaBell />
                      </span>
                      <span>{notification.message}</span>
                    </div>
                    {notification.order && (
                      <p className="text-sm text-stone-600">
                        Order #{notification.order._id?.slice(-6)} • {notification.order.status?.replaceAll("-", " ")}
                      </p>
                    )}
                  </div>

                  <span className="rounded-full bg-stone-200 px-3 py-1 text-xs uppercase tracking-[0.16em] text-stone-700">
                    {notification.type.replaceAll("-", " ")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Notifications;
