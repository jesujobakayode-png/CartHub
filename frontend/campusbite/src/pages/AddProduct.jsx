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
    <div className="max-w-2xl mx-auto bg-[#fbfaf7] p-6 rounded-2xl shadow-sm border border-stone-300 sm:p-8">

      <h1 className="text-3xl font-bold text-stone-950 mb-6">
        Add New Product
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">

        <input
          type="text"
          name="name"
          placeholder="Product Name"
          onChange={handleChange}
          className="w-full p-3 rounded-lg bg-stone-50 border border-stone-200 outline-none focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-100"
          required
        />

        <input
          type="number"
          name="price"
          placeholder="Price"
          onChange={handleChange}
          className="w-full p-3 rounded-lg bg-stone-50 border border-stone-200 outline-none focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-100"
          required
        />

        <input
          type="text"
          name="category"
          placeholder="Category"
          onChange={handleChange}
          className="w-full p-3 rounded-lg bg-stone-50 border border-stone-200 outline-none focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-100"
        />

        <input
          type="text"
          name="image"
          placeholder="Image URL"
          onChange={handleChange}
          className="w-full p-3 rounded-lg bg-stone-50 border border-stone-200 outline-none focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-100"
        />

        <textarea
          name="description"
          placeholder="Description"
          rows="4"
          onChange={handleChange}
          className="w-full p-3 rounded-lg bg-stone-50 border border-stone-200 outline-none focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-100"
        />

        <button
          className="w-full border border-amber-500 bg-amber-500 hover:bg-amber-400 transition py-3 rounded-lg font-bold text-black"
        >
          Add Product
        </button>

      </form>

    </div>
  );
}

export default AddProduct;
