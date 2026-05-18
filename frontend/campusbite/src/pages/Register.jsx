import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import API from "../services/api";

function Register() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "buyer",
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

      await API.post(
        "/auth/register",
        formData
      );

      alert("Registration successful");

      navigate("/login");

    } catch (error) {
      console.log(error);
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
            placeholder="Name"
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-[#1c120d] border border-yellow-700"
          />

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

          <select
            name="role"
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