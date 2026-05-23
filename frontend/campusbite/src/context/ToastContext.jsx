import {
  createContext,
  useCallback,
  useState,
} from "react";

import Toast from "../components/Toast";

export const ToastContext =
  createContext();

function ToastProvider({
  children,
}) {

  const [toast, setToast] =
    useState(null);


  const showToast = useCallback(({
    message,
    type = "success",
  }) => {

    setToast({
      message,
      type,
    });

    setTimeout(() => {

      setToast(null);

    }, 3000);
  }, []);


  return (
    <ToastContext.Provider
      value={{
        showToast,
      }}
    >

      {children}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
        />
      )}

    </ToastContext.Provider>
  );
}

export default ToastProvider;
