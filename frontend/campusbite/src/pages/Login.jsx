import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Loader from "../components/Loader";
import { AuthContext } from "../context/AuthContext";
import { ToastContext } from "../context/ToastContext";
import API from "../services/api";

function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const { showToast } = useContext(ToastContext);

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await API.post("/auth/login", formData);

      login(res.data);

      if (showToast) {
        showToast({
          message: "Login successful",
          type: "success",
        });
      }

      if (res.data.user.role === "vendor") {
        navigate("/vendor-dashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.log(error.response || error);

      if (showToast) {
        showToast({
          message: error.response?.data?.message || "Invalid credentials",
          type: "error",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-7rem)] items-center justify-center bg-[#120b08] px-2 py-6 text-white sm:px-4">
      {loading && <Loader />}

      <div className="w-full max-w-md rounded-2xl border border-yellow-700 bg-[#2c1b12] p-5 shadow-2xl sm:p-8">
        <h1 className="mb-2 text-center text-3xl font-bold text-yellow-500 sm:text-4xl">
          Welcome Back
        </h1>

        <p className="mb-8 text-center text-sm text-gray-400 sm:text-base">
          Login to continue ordering
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="email"
            name="email"
            value={formData.email}
            placeholder="Email"
            onChange={handleChange}
            className="min-h-12 w-full rounded-lg border border-yellow-700 bg-[#1c120d] p-3 outline-none transition focus:border-yellow-500"
            required
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              placeholder="Password"
              onChange={handleChange}
              className="min-h-12 w-full rounded-lg border border-yellow-700 bg-[#1c120d] p-3 pr-20 outline-none transition focus:border-yellow-500"
              required
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-3 flex items-center text-sm font-semibold text-yellow-400"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="min-h-12 w-full rounded-lg bg-yellow-500 py-3 font-bold text-black transition hover:bg-yellow-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Signing In..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-300">
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-yellow-500 hover:text-yellow-400"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
