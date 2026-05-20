import { useContext, useEffect, useRef, useState } from "react";
import API from "../services/api";
import ProductCard from "../components/ProductCard";
import { AuthContext } from "../context/AuthContext";
import DashboardAnalytics from "../components/DashboardAnalytics";

const emptyForm = {
  name: "",
  price: "",
  category: "",
  description: "",
  image: "",
};

function VendorDashboard() {
  const { user } = useContext(AuthContext);
  const actualRole = user?.user?.role || user?.role;
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [editingProductId, setEditingProductId] = useState(null);
  const [activeSection, setActiveSection] = useState("dashboard");
  const formRef = useRef(null);
  const productsRef = useRef(null);
  const dashboardRef = useRef(null);
  const ordersRef = useRef(null);
  const analyticsRef = useRef(null);

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
    if (actualRole !== "vendor") {
      return;
    }

    const loadVendorData = async () => {
      try {
        const productsRes = await API.get("/products");
        const ordersRes = await API.get("/orders");

        const productList = Array.isArray(productsRes.data)
          ? productsRes.data
          : productsRes.data?.value;

        setProducts(Array.isArray(productList) ? productList : []);
        setOrders(Array.isArray(ordersRes.data) ? ordersRes.data : ordersRes.data || []);
      } catch (error) {
        console.log(error);
        setProducts([]);
        setOrders([]);
      }
    };

    loadVendorData();
  }, [actualRole]);

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

  const scrollToSection = (sectionRef, sectionName) => {
    sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveSection(sectionName);
  };

  const scrollToProducts = () => {
    scrollToSection(productsRef, "products");
  };

  useEffect(() => {
    const sections = [
      { ref: dashboardRef, name: "dashboard" },
      { ref: ordersRef, name: "orders" },
      { ref: analyticsRef, name: "analytics" },
      { ref: productsRef, name: "products" },
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter((entry) => entry.isIntersecting);
        if (visibleEntries.length === 0) {
          return;
        }

        visibleEntries.sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        setActiveSection(visibleEntries[0].target.dataset.section || "dashboard");
      },
      {
        root: null,
        rootMargin: "-35% 0px -55% 0px",
        threshold: [0.35, 0.5, 0.75],
      }
    );

    sections.forEach((item) => {
      if (item.ref.current) {
        item.ref.current.dataset.section = item.name;
        observer.observe(item.ref.current);
      }
    });

    return () => {
      sections.forEach((item) => {
        if (item.ref.current) {
          observer.unobserve(item.ref.current);
        }
      });
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.price || !formData.category || !formData.description || !formData.image) {
      return;
    }

    try {
      if (editingProductId) {
        await API.put(`/products/${editingProductId}`, formData);
      } else {
        await API.post("/products", formData);
      }

      resetForm();
      fetchProducts();
    } catch (error) {
      console.log(error);
    }
  };

  if (actualRole !== "vendor") {
    return (
      <div className="min-h-screen bg-[#120b08] text-white flex items-center justify-center p-8">
        <div className="bg-[#2c1b12] border border-yellow-700 rounded-2xl p-10 max-w-xl text-center">
          <h1 className="text-3xl font-bold text-yellow-500 mb-4">Access Denied</h1>
          <p className="text-gray-300">
            The vendor dashboard is only available to vendor accounts. Please login with a vendor account.
          </p>
        </div>
      </div>
    );
  }

  const totalProducts = products.length;
  const totalValue = products.reduce(
    (sum, p) => sum + Number(p.price || 0),
    0
  );

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#120b08] text-white">
      <div className="w-full md:w-56 bg-[#1c120d] border-b md:border-b-0 md:border-r border-yellow-700 p-5 md:sticky top-20 md:h-[calc(100vh-5rem)] self-start">
        <h1 className="text-xl font-bold text-yellow-500 mb-10">Vendor Panel</h1>

        <nav className="space-y-3">
          <button
            type="button"
            onClick={() => scrollToSection(dashboardRef, "dashboard")}
            className={`block w-full text-left rounded-lg px-3 py-2 transition duration-200 ${activeSection === "dashboard" ? "bg-yellow-500/20 text-yellow-100 font-semibold" : "text-yellow-300 hover:text-yellow-100 hover:bg-yellow-500/10"}`}
          >
            Dashboard
          </button>
          <button
            type="button"
            onClick={() => scrollToSection(ordersRef, "orders")}
            className={`block w-full text-left rounded-lg px-3 py-2 transition duration-200 ${activeSection === "orders" ? "bg-yellow-500/20 text-yellow-100 font-semibold" : "text-yellow-300 hover:text-yellow-100 hover:bg-yellow-500/10"}`}
          >
            Orders
          </button>
          <button
            type="button"
            onClick={() => scrollToSection(analyticsRef, "analytics")}
            className={`block w-full text-left rounded-lg px-3 py-2 transition duration-200 ${activeSection === "analytics" ? "bg-yellow-500/20 text-yellow-100 font-semibold" : "text-yellow-300 hover:text-yellow-100 hover:bg-yellow-500/10"}`}
          >
            Analytics
          </button>
          <button
            type="button"
            onClick={scrollToProducts}
            className={`block w-full text-left rounded-lg px-3 py-2 transition duration-200 ${activeSection === "products" ? "bg-yellow-500/20 text-yellow-100 font-semibold" : "text-yellow-300 hover:text-yellow-100 hover:bg-yellow-500/10"}`}
          >
            Products
          </button>
        </nav>
      </div>

      <div className="flex-1 p-4 md:p-8">
        <div ref={dashboardRef} className="scroll-mt-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
            <div className="bg-[#2c1b12] border border-yellow-700 p-5 rounded-xl">
              <p className="text-gray-300">Total Products</p>
              <h2 className="text-3xl font-bold text-yellow-500">{totalProducts}</h2>
            </div>

            <div className="bg-[#2c1b12] border border-yellow-700 p-5 rounded-xl">
              <p className="text-gray-300">Inventory Value</p>
              <h2 className="text-3xl font-bold text-yellow-500">NGN {totalValue}</h2>
            </div>

            <div className="bg-[#2c1b12] border border-yellow-700 p-5 rounded-xl">
              <p className="text-gray-300">Status</p>
              <h2 className="text-2xl font-bold text-green-400">Active</h2>
            </div>
          </div>

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
        </div>

        <div ref={ordersRef} className="scroll-mt-24 mb-10">
          <h2 className="text-2xl font-bold text-yellow-500 mb-5">Vendor Orders</h2>
          <div className="grid grid-cols-1 gap-4">
            {orders.length === 0 ? (
              <div className="bg-[#2c1b12] border border-yellow-700 rounded-2xl p-6 text-gray-300">
                No orders yet.
              </div>
            ) : (
              orders.map((order) => (
                <div key={order._id} className="bg-[#2c1b12] border border-yellow-700 rounded-2xl p-6">
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between gap-4">
                      <p className="font-semibold text-yellow-400">Order ID:</p>
                      <p className="text-gray-300">{order._id}</p>
                    </div>
                    <div className="flex justify-between gap-4">
                      <p className="font-semibold text-yellow-400">Status:</p>
                      <p className="text-gray-300">{order.status || "N/A"}</p>
                    </div>
                    <div className="flex justify-between gap-4">
                      <p className="font-semibold text-yellow-400">Total:</p>
                      <p className="text-gray-300">NGN {order.totalPrice || 0}</p>
                    </div>
                    <div className="flex justify-between gap-4">
                      <p className="font-semibold text-yellow-400">Buyer:</p>
                      <p className="text-gray-300">{order.user?.name || order.user || "Unknown"}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div ref={analyticsRef} className="scroll-mt-24 mb-10">
          <DashboardAnalytics orders={orders} products={products} />
        </div>

        <div ref={productsRef} className="scroll-mt-24">
          <h2 className="text-2xl font-bold text-yellow-500 mb-5">Added Products</h2>

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
