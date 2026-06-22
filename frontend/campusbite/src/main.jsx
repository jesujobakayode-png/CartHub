import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import CartProvider from "./context/CartContext";
import AuthProvider from "./context/AuthProvider";
import ToastProvider from "./context/ToastContext";
import NotificationProvider from "./context/NotificationContext";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <NotificationProvider>
        <CartProvider>
          <ToastProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </ToastProvider>
        </CartProvider>
      </NotificationProvider>
    </AuthProvider>
  </React.StrictMode>,
)
