import { createContext, useCallback, useState } from "react";

export const ToastContext = createContext();

let idCounter = 0;

function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback(({ message, type = "info", duration = 3000 }) => {
    const id = ++idCounter;
    setToasts((t) => [...t, { id, message, type }]);

    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      <div className="fixed top-5 right-5 z-50 flex flex-col gap-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`max-w-sm w-full px-4 py-3 rounded-lg shadow-lg text-sm text-black font-semibold transition transform origin-top-right
              ${toast.type === "success" ? "bg-green-400" : toast.type === "error" ? "bg-red-400" : "bg-yellow-300"}`}
          >
            {toast.message}
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-3 float-right font-bold"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export default ToastProvider;
