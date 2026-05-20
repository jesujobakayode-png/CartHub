import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";

import API from "../services/api";
import { ToastContext } from "../context/ToastContext";

function Register() {

  const navigate = useNavigate();
  const { showToast } = useContext(ToastContext);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "buyer",
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

    if (!formData.name || !formData.email || !formData.password) {
      if (showToast) showToast({ message: "Please fill in all registration fields", type: "error" });
      return;
    }

    try {
      await API.post(
        "/auth/register",
        formData
      );

      if (showToast) showToast({ message: "Account created successfully", type: "success" });

      navigate("/login");

    } catch (error) {
      console.log(error.response || error);
      const message = error.response?.data?.message || "Registration failed";
      if (showToast) showToast({ message, type: "error" });
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-[#120b08] text-white">

      <div className="bg-[#2c1b12] p-8 rounded-2xl border border-yellow-700 w-full max-w-md">

        <h1 className="text-4xl font-bold text-yellow-500 mb-6 text-center">
          Register
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          <input
            type="text"
            name="name"
            value={formData.name}
            placeholder="Name"
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-[#1c120d] border border-yellow-700"
          />

          <input
            type="email"
            name="email"
            value={formData.email}
            placeholder="Email"
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-[#1c120d] border border-yellow-700"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              placeholder="Password"
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-[#1c120d] border border-yellow-700 pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-3 flex items-center text-yellow-400"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-6 w-6"
                >
                  <path d="M12 5c-7 0-10 5.4-10 7s3 7 10 7 10-5.4 10-7-3-7-10-7zm0 12c-2.8 0-5-2.2-5-5s2.2-5 5-5 5 2.2 5 5-2.2 5-5 5z" />
                  <path d="M12 9c-1.7 0-3 1.3-3 3s1.3 3 3 3 3-1.3 3-3-1.3-3-3-3z" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-6 w-6"
                >
                  <path d="M12 5c-7 0-10 5.4-10 7s3 7 10 7c1.8 0 3.4-.5 4.8-1.3l1.6 1.6 1.4-1.4-18-18-1.4 1.4 3.3 3.3c1.3-1 2.7-1.7 4.7-1.7 7 0 10 5.4 10 7 0 1.2-.7 2.8-1.7 3.8l1.7 1.7c1.2-1.1 2.1-2.8 2.1-5.5 0-1.4-1.6-6-10-6-2.5 0-4.7.7-6.6 1.9l1.5 1.5c1.4-.7 3-.9 4.6-.9z" />
                  <path d="M4.9 4.9l1.4 1.4C4.2 8.5 2 11.2 2 12c0 1 .6 2.7 1.9 4.2l1.4-1.4C5.4 13.7 5 12.9 5 12c0-1.1.7-2.4 1.9-3.6l1.4 1.4C8.1 10.5 8 11.2 8 12c0 .5.1 1 .2 1.4l1.8 1.8c.4.1.9.2 1.4.2 1.7 0 3-1.3 3-3 0-.5-.1-1-.2-1.4l1.4 1.4c.1.3.2.7.2 1 0 2.2-1.8 4-4 4-.5 0-1-.1-1.4-.2l1.4 1.4c.4.1.9.2 1.4.2 2.8 0 5-2.2 5-5 0-.7-.1-1.4-.4-2l1.5-1.5c.9 1.2 1.4 2.5 1.4 3.9 0 1.9-1.1 3.8-2.9 5.3l1.4 1.4c2-1.7 3.5-3.8 3.5-6.7 0-1.8-1-4.6-5.2-7.5l1.5-1.5-1.4-1.4-1.7 1.7c-1.3-.6-2.8-.9-4.3-.9z" />
                </svg>
              )}
            </button>
          </div>

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-[#1c120d] border border-yellow-700"
          >
            <option value="buyer">
              Buyer
            </option>

            <option value="vendor">
              Vendor
            </option>
          </select>

          <button className="w-full bg-yellow-500 hover:bg-yellow-400 transition text-black py-3 rounded-lg font-bold">
            Register
          </button>

        </form>

        <p className="mt-5 text-center">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-yellow-500"
          >
            Login
          </Link>
        </p>

      </div>

    </div>
  );
}

export default Register;