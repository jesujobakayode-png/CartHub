import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { AuthContext } from "./AuthContext";
import { onEvent, offEvent } from "../utils/socket";

export const NotificationContext = createContext(null);

export function useNotification() {
  return useContext(NotificationContext);
}

const MAX_NOTIFICATIONS = 50;
const isDev = import.meta.env.DEV;

const statusMessages = {
  pending: "waiting for seller confirmation",
  preparing: "being prepared",
  "out-for-delivery": "out for delivery",
  delivered: "delivered",
  cancelled: "cancelled",
};

function formatOrderId(order) {
  return order?._id ? order._id.slice(-6) : "update";
}

function formatStatus(status) {
  return statusMessages[status] || status?.replaceAll("-", " ") || "updated";
}

function getStorageKey(user) {
  return user?.id ? `campusbite_notifications_${user.role}_${user.id}` : null;
}

function readSavedNotifications(storageKey) {
  if (!storageKey || typeof window === "undefined") {
    return [];
  }

  try {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.warn("Could not load notifications", error);
    return [];
  }
}

function createNotification(payload, user) {
  const orderId = payload.order?._id || "unknown";
  const status = payload.order?.vendorStatus || payload.order?.status || "pending";
  const type = payload.type || "notification";
  const audience = payload.audience || user?.role || "buyer";
  const createdAt = payload.createdAt || payload.order?.updatedAt || payload.order?.createdAt || new Date().toISOString();

  let message = payload.message;

  if (!message && type === "order-created") {
    message = `Your order #${formatOrderId(payload.order)} was placed successfully.`;
  }

  if (!message && type === "new-order") {
    message = `New shopper order #${formatOrderId(payload.order)} needs attention.`;
  }

  if (!message && type === "order-updated") {
    message =
      audience === "vendor"
        ? `Order #${formatOrderId(payload.order)} is now ${formatStatus(status)}.`
        : `Your order #${formatOrderId(payload.order)} is ${formatStatus(status)}.`;
  }

  return {
    id:
      payload.id ||
      `${type}-${orderId}-${status}-${createdAt}`,
    type,
    message: message || "New update available.",
    order: payload.order || null,
    createdAt,
    read: false,
  };
}

function NotificationProvider({ children }) {
  const { user } = useContext(AuthContext);
  const storageKey = useMemo(() => getStorageKey(user), [user]);
  const [loadedKey, setLoadedKey] = useState(storageKey);
  const [notifications, setNotifications] = useState(() =>
    readSavedNotifications(storageKey)
  );

  const addNotification = useCallback(
    (payload) => {
      const next = createNotification(payload, user);
      setNotifications((prev) => [
        next,
        ...prev.filter((item) => item.id !== next.id),
      ].slice(0, MAX_NOTIFICATIONS));
    },
    [user]
  );

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => {
      if (!prev.some((item) => !item.read)) {
        return prev;
      }

      return prev.map((item) => ({ ...item, read: true }));
    });
  }, []);

  useEffect(() => {
    if (!storageKey) {
      setNotifications([]);
      setLoadedKey(null);
      return;
    }

    setNotifications(readSavedNotifications(storageKey));
    setLoadedKey(storageKey);
  }, [storageKey]);

  useEffect(() => {
    if (!storageKey || loadedKey !== storageKey) {
      return;
    }

    localStorage.setItem(storageKey, JSON.stringify(notifications));
  }, [loadedKey, notifications, storageKey]);

  useEffect(() => {
    if (!user) {
      return;
    }

    const handleNotification = (payload) => {
      if (isDev) {
        console.log("Received notification:", payload);
      }
      addNotification(payload);
    };

    const handleOrderCreated = (order) => {
      if (isDev) {
        console.log("Order created event:", order);
      }
      addNotification({
        type: "order-created",
        audience: "buyer",
        order,
      });
    };

    const handleNewOrder = (order) => {
      if (isDev) {
        console.log("New order event:", order);
      }
      addNotification({
        type: "new-order",
        audience: "vendor",
        order,
      });
    };

    const handleOrderUpdated = (order) => {
      if (isDev) {
        console.log("Order updated event:", order);
      }
      addNotification({
        type: "order-updated",
        audience: user.role,
        order,
      });
    };

    // Delay setting up listeners to ensure socket is connected
    const timer = setTimeout(() => {
      onEvent("notification", handleNotification);
      onEvent("orderCreated", handleOrderCreated);
      onEvent("newOrder", handleNewOrder);
      onEvent("orderUpdated", handleOrderUpdated);
    }, 500);

    return () => {
      clearTimeout(timer);
      offEvent("notification", handleNotification);
      offEvent("orderCreated", handleOrderCreated);
      offEvent("newOrder", handleNewOrder);
      offEvent("orderUpdated", handleOrderUpdated);
    };
  }, [addNotification, user]);

  const unreadCount = notifications.filter((item) => !item.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        clearNotifications,
        markAllAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export default NotificationProvider;
