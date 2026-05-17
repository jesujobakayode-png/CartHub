import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import API from "../services/api";

function EditProduct() {

  const { id } = useParams();

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    image: ""
  });
  const [loading, setLoading] = useState(true);

  const fetchProduct = async () => {
    try {

      const res = await API.get(`/products/${id}`);

      setFormData({
        name: res.data.name || "",
        price: res.data.price || "",
        category: res.data.category || "",
        description: res.data.description || "",
        image: res.data.image || ""
      });

    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      await API.put(`/products/${id}`, formData);

      navigate("/");

    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return <p>Loading product...</p>;
  }

  return (
    <div className="max-w-2xl mx-auto bg-[#2c1b12] p-8 rounded-2xl shadow-lg border border-yellow-700">

      <h1 className="text-3xl font-bold text-yellow-500 mb-6">
        Edit Product
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">

        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-3 rounded-lg bg-[#1c120d] border border-yellow-700 outline-none"
          required
        />

        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          className="w-full p-3 rounded-lg bg-[#1c120d] border border-yellow-700 outline-none"
          required
        />

        <input
          type="text"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full p-3 rounded-lg bg-[#1c120d] border border-yellow-700 outline-none"
        />

        <input
          type="text"
          name="image"
          value={formData.image}
          onChange={handleChange}
          className="w-full p-3 rounded-lg bg-[#1c120d] border border-yellow-700 outline-none"
        />

        <textarea
          name="description"
          rows="4"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-3 rounded-lg bg-[#1c120d] border border-yellow-700 outline-none"
        />

        <button
          className="w-full bg-yellow-600 hover:bg-yellow-500 transition py-3 rounded-lg font-bold text-black"
        >
          Update Product
        </button>

      </form>

    </div>
  );
}

export default EditProduct;
