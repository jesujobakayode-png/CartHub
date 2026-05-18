import { useEffect, useRef, useState } from "react";
import API from "../services/api";
import ProductCard from "../components/ProductCard";

const emptyForm = {
  name: "",
  price: "",
  category: "",
  description: "",
  image: "",
};

function VendorDashboard() {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [editingProductId, setEditingProductId] = useState(null);
  const formRef = useRef(null);
  const productsRef = useRef(null);

  const fetchProducts = async () => {
    try {
      const res = await API.get("/products");

      const productList = Array.isArray(res.data)
        ? res.data
        : res.data?.value;

      setProducts(Array.isArray(productList) ? productList : []);
    } catch (error) {
      console.log(error);
      setProducts([]);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const totalProducts = products.length;
  const totalValue = products.reduce(
    (sum, p) => sum + Number(p.price || 0),
    0
  );

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setEditingProductId(null);
  };

  const startEdit = (product) => {
    setEditingProductId(product._id);
    setFormData(product);
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const scrollToProducts = () => {
    productsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingProductId) {
      await API.put(`/products/${editingProductId}`, formData);
    } else {
      await API.post("/products", formData);
    }

    resetForm();
    fetchProducts();
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#120b08] text-white">
      
      {/* SIDEBAR */}
      <div className="w-full md:w-56 bg-[#1c120d] border-b md:border-b-0 md:border-r border-yellow-700 p-5 md:sticky top-20 md:h-[calc(100vh-5rem)] self-start">
        <h1 className="text-xl font-bold text-yellow-500 mb-10">
          Vendor Panel
        </h1>

        <nav className="space-y-4">
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="block text-left text-yellow-400 cursor-pointer"
          >
            Dashboard
          </button>
          <button
            type="button"
            onClick={scrollToProducts}
            className="block text-left hover:text-yellow-400 cursor-pointer transition"
          >
            Products
          </button>
          <button
            type="button"
            className="block text-left hover:text-yellow-400 cursor-pointer transition"
          >
            Orders
          </button>
          <button
            type="button"
            className="block text-left hover:text-yellow-400 cursor-pointer transition"
          >
            Analytics
          </button>
        </nav>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-4 md:p-8">

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">

          <div className="bg-[#2c1b12] border border-yellow-700 p-5 rounded-xl">
            <p className="text-gray-300">Total Products</p>
            <h2 className="text-3xl font-bold text-yellow-500">
              {totalProducts}
            </h2>
          </div>

          <div className="bg-[#2c1b12] border border-yellow-700 p-5 rounded-xl">
            <p className="text-gray-300">Inventory Value</p>
            <h2 className="text-3xl font-bold text-yellow-500">
              NGN {totalValue}
            </h2>
          </div>

          <div className="bg-[#2c1b12] border border-yellow-700 p-5 rounded-xl">
            <p className="text-gray-300">Status</p>
            <h2 className="text-2xl font-bold text-green-400">
              Active
            </h2>
          </div>

        </div>

        {/* FORM */}
        <div ref={formRef} className="bg-[#2c1b12] p-6 rounded-xl border border-yellow-700 mb-10 scroll-mt-24">
          <h2 className="text-2xl font-bold text-yellow-500 mb-4">
            {editingProductId ? "Edit Product" : "Add Product"}
          </h2>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name"
              className="p-3 bg-[#1c120d] border border-yellow-700 rounded"
            />

            <input
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Price"
              className="p-3 bg-[#1c120d] border border-yellow-700 rounded"
            />

            <input
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="Category"
              className="p-3 bg-[#1c120d] border border-yellow-700 rounded"
            />

            <input
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="Image URL"
              className="p-3 bg-[#1c120d] border border-yellow-700 rounded"
            />

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description"
              className="p-3 bg-[#1c120d] border border-yellow-700 rounded md:col-span-2"
            />

            <button className="bg-yellow-500 text-black py-3 rounded font-bold md:col-span-2">
              {editingProductId ? "Update Product" : "Add Product"}
            </button>

          </form>
        </div>

        {/* PRODUCTS */}
        <div ref={productsRef} className="scroll-mt-24">
          <h2 className="text-2xl font-bold text-yellow-500 mb-5">
            Added Products
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                fetchProducts={fetchProducts}
                isVendor={true}
                onEdit={startEdit}
              />
            ))}

          </div>
        </div>

      </div>
    </div>
  );
}

export default VendorDashboard;
