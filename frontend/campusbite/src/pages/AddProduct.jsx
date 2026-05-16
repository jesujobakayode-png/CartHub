import { useState } from "react";
import { useNavigate } from "react-router-dom";

import API from "../services/api";

function AddProduct() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    image: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      await API.post("/products", formData);

      navigate("/");

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-[#2c1b12] p-8 rounded-2xl shadow-lg border border-yellow-700">

      <h1 className="text-3xl font-bold text-yellow-500 mb-6">
        Add New Product
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">

        <input
          type="text"
          name="name"
          placeholder="Product Name"
          onChange={handleChange}
          className="w-full p-3 rounded-lg bg-[#1c120d] border border-yellow-700 outline-none"
          required
        />

        <input
          type="number"
          name="price"
          placeholder="Price"
          onChange={handleChange}
          className="w-full p-3 rounded-lg bg-[#1c120d] border border-yellow-700 outline-none"
          required
        />

        <input
          type="text"
          name="category"
          placeholder="Category"
          onChange={handleChange}
          className="w-full p-3 rounded-lg bg-[#1c120d] border border-yellow-700 outline-none"
        />

        <input
          type="text"
          name="image"
          placeholder="Image URL"
          onChange={handleChange}
          className="w-full p-3 rounded-lg bg-[#1c120d] border border-yellow-700 outline-none"
        />

        <textarea
          name="description"
          placeholder="Description"
          rows="4"
          onChange={handleChange}
          className="w-full p-3 rounded-lg bg-[#1c120d] border border-yellow-700 outline-none"
        />

        <button
          className="w-full bg-yellow-600 hover:bg-yellow-500 transition py-3 rounded-lg font-bold text-black"
        >
          Add Product
        </button>

      </form>

    </div>
  );
}

export default AddProduct;