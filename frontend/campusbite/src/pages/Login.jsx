import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import API from "../services/api";
import { AuthContext } from "../context/AuthContext";

function Login() {

  const navigate = useNavigate();

  const { login } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      const res = await API.post(
        "/auth/login",
        formData
      );

      login(res.data);

      if (res.data.user.role === "vendor") {
        navigate("/vendor-dashboard");
      } else {
        navigate("/");
      }

    } catch (error) {
      console.log(error);
      alert("Invalid credentials");
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-[#120b08] text-white">

      <div className="bg-[#2c1b12] p-8 rounded-2xl border border-yellow-700 w-full max-w-md">

        <h1 className="text-4xl font-bold text-yellow-500 mb-6 text-center">
          Login
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-[#1c120d] border border-yellow-700"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-[#1c120d] border border-yellow-700"
          />

          <button className="w-full bg-yellow-500 hover:bg-yellow-400 transition text-black py-3 rounded-lg font-bold">
            Login
          </button>

        </form>

        <p className="mt-5 text-center">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-yellow-500"
          >
            Register
          </Link>
        </p>

      </div>

    </div>
  );
}

export default Login;