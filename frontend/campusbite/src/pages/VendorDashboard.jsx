import { useContext, useEffect, useRef, useState } from "react";

import DashboardAnalytics from "../components/DashboardAnalytics";
import ProductCard from "../components/ProductCard";
import { AuthContext } from "../context/AuthContext";
import { ToastContext } from "../context/ToastContext";
import API from "../services/api";

const emptyForm = {
  name: "",
  price: "",
  category: "",
  description: "",
  image: "",
};

function VendorDashboard() {
  const { user } = useContext(AuthContext);
  const { showToast } = useContext(ToastContext);
  const actualRole = user?.user?.role || user?.role;

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [editingProductId, setEditingProductId] = useState(null);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [uploading, setUploading] = useState(false);

  const formRef = useRef(null);
  const productsRef = useRef(null);
  const dashboardRef = useRef(null);
  const ordersRef = useRef(null);
  const analyticsRef = useRef(null);

  const fetchProducts = async () => {
    try {
      const res = await API.get("/products/vendor/my-products");
      const productList = Array.isArray(res.data) ? res.data : res.data?.value;

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
        const productsRes = await API.get("/products/vendor/my-products");
        const ordersRes = await API.get("/orders");
        const productList = Array.isArray(productsRes.data)
          ? productsRes.data
          : productsRes.data?.value;

        setProducts(Array.isArray(productList) ? productList : []);
        setOrders(Array.isArray(ordersRes.data) ? ordersRes.data : []);
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
    setFormData({
      name: product.name || "",
      price: product.price || "",
      category: product.category || "",
      description: product.description || "",
      image: product.image || "",
    });
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const uploadImage = async (e) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    setUploading(true);

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "campusbite");

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dcptr9k9n/image/upload",
        {
          method: "POST",
          body: data,
        }
      );

      const result = await res.json();

      setFormData((prev) => ({
        ...prev,
        image: result.secure_url,
      }));
    } catch (error) {
      console.log("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.price ||
      !formData.category ||
      !formData.description ||
      !formData.image
    ) {
      return;
    }

    try {
      if (editingProductId) {
        await API.put(`/products/${editingProductId}`, formData);
        if (showToast) {
          showToast({
            message: "Product updated successfully",
            type: "success",
          });
        }
      } else {
        await API.post("/products", formData);
        if (showToast) {
          showToast({
            message: "Product added successfully",
            type: "success",
          });
        }
      }

      resetForm();
      fetchProducts();
    } catch (error) {
      console.log(error);
    }
  };

  if (actualRole !== "vendor") {
    return (
      <div className="flex min-h-[70vh] items-center justify-center text-white">
        <div className="w-full max-w-md rounded-xl border border-yellow-700 bg-[#2c1b12] p-8 text-center">
          <h1 className="text-2xl font-bold text-yellow-500">Access Denied</h1>
        </div>
      </div>
    );
  }

  const totalProducts = products.length;
  const totalValue = products.reduce(
    (sum, p) => sum + Number(p.price || 0),
    0
  );

  const navItems = [
    { label: "Dashboard", ref: dashboardRef, id: "dashboard" },
    { label: "Orders", ref: ordersRef, id: "orders" },
    { label: "Analytics", ref: analyticsRef, id: "analytics" },
    { label: "Products", ref: productsRef, id: "products" },
  ];

  const scrollToSection = (item) => {
    setActiveSection(item.id);
    item.ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-[#120b08] text-white lg:-mx-4 lg:-my-6">
      <div className="lg:flex lg:min-h-screen">
        <aside className="sticky top-22.25 z-30 -mx-4 mb-6 border-y border-yellow-700 bg-[#1c120d]/95 px-4 py-3 backdrop-blur lg:top-0 lg:mx-0 lg:mb-0 lg:h-screen lg:w-64 lg:shrink-0 lg:border-y-0 lg:border-r lg:p-6">
          <h1 className="hidden text-xl font-bold text-yellow-500 lg:block">
            Vendor Panel
          </h1>

          <nav className="flex gap-2 overflow-x-auto pb-1 lg:mt-8 lg:block lg:space-y-3 lg:overflow-visible lg:pb-0">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => scrollToSection(item)}
                className={`shrink-0 rounded-lg px-4 py-2 text-sm font-semibold transition lg:block lg:w-full lg:text-left ${
                  activeSection === item.id
                    ? "bg-yellow-500 text-black"
                    : "bg-[#2c1b12] text-yellow-300 hover:bg-yellow-500/20 hover:text-yellow-100"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        <main className="flex-1 space-y-8 pb-8 lg:px-8 lg:py-8">
          <section ref={dashboardRef} className="scroll-mt-40 lg:scroll-mt-8">
            <div className="mb-5">
              <h2 className="text-2xl font-bold text-yellow-500 sm:text-3xl">
                Dashboard
              </h2>
              <p className="mt-1 text-sm text-gray-400">
                Manage your menu, orders, and performance.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <div className="rounded-xl border border-yellow-700 bg-[#2c1b12] p-5">
                <p className="text-sm text-gray-400">Total Products</p>
                <p className="mt-2 text-3xl font-bold text-yellow-500">
                  {totalProducts}
                </p>
              </div>

              <div className="rounded-xl border border-yellow-700 bg-[#2c1b12] p-5">
                <p className="text-sm text-gray-400">Inventory Value</p>
                <p className="mt-2 wrap-break-word text-2xl font-bold text-yellow-500 sm:text-3xl">
                  NGN {totalValue}
                </p>
              </div>

              <div className="rounded-xl border border-yellow-700 bg-[#2c1b12] p-5 sm:col-span-2 xl:col-span-1">
                <p className="text-sm text-gray-400">Status</p>
                <p className="mt-2 text-2xl font-bold text-green-400 sm:text-3xl">
                  Active
                </p>
              </div>
            </div>
          </section>

          <section
            ref={formRef}
            className="scroll-mt-40 rounded-xl border border-yellow-700 bg-[#2c1b12] p-4 sm:p-6 lg:scroll-mt-8"
          >
            <h2 className="mb-4 text-xl font-bold text-yellow-500 sm:text-2xl">
              {editingProductId ? "Edit Product" : "Add Product"}
            </h2>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name"
                className="min-h-12 w-full rounded-lg border border-yellow-700 bg-[#1c120d] p-3 outline-none transition focus:border-yellow-500"
              />

              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Price"
                className="min-h-12 w-full rounded-lg border border-yellow-700 bg-[#1c120d] p-3 outline-none transition focus:border-yellow-500"
              />

              <input
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="Category"
                className="min-h-12 w-full rounded-lg border border-yellow-700 bg-[#1c120d] p-3 outline-none transition focus:border-yellow-500"
              />

              <div className="md:row-span-2">
                <label className="mb-2 block text-sm font-semibold text-yellow-300">
                  Product image
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={uploadImage}
                  className="min-h-12 w-full rounded-lg border border-yellow-700 bg-[#1c120d] p-3 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-yellow-500 file:px-3 file:py-2 file:font-semibold file:text-black"
                />

                {!formData.image && (
                  <div className="mt-3 flex aspect-video w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-yellow-700 bg-[#1c120d] px-4 text-center">
                    <span className="text-sm font-semibold text-yellow-300">
                      Product image upload
                    </span>
                    <span className="mt-1 text-xs leading-5 text-gray-400">
                      Add the food photo customers will see on your menu.
                    </span>
                  </div>
                )}

                <p className="mt-2 text-xs leading-5 text-gray-400">
                  Upload a clear photo of the meal customers will see on the
                  menu.
                </p>

                {uploading && (
                  <p className="mt-2 text-sm text-yellow-400">Uploading...</p>
                )}

                {formData.image && (
                  <img
                    src={formData.image}
                    alt="Product preview"
                    className="mt-3 aspect-video w-full rounded-lg object-cover"
                  />
                )}
              </div>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Description"
                className="min-h-32 w-full rounded-lg border border-yellow-700 bg-[#1c120d] p-3 outline-none transition focus:border-yellow-500"
              />

              <button className="min-h-12 rounded-lg bg-yellow-500 px-5 py-3 font-bold text-black transition hover:bg-yellow-400 md:col-span-2">
                {editingProductId ? "Update" : "Add Product"}
              </button>
            </form>
          </section>

          <section ref={ordersRef} className="scroll-mt-40 lg:scroll-mt-8">
            <h2 className="mb-4 text-xl font-bold text-yellow-500 sm:text-2xl">
              Orders
            </h2>

            {orders.length === 0 ? (
              <div className="rounded-xl border border-yellow-700 bg-[#2c1b12] p-5 text-gray-400">
                No orders yet.
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => (
                  <div
                    key={order._id}
                    className="rounded-xl border border-yellow-700 bg-[#2c1b12] p-4"
                  >
                    <div className="grid gap-3 text-sm sm:grid-cols-3">
                      <p className="min-w-0 wrap-break-word">
                        <span className="block text-gray-400">Order</span>
                        {order._id}
                      </p>
                      <p>
                        <span className="block text-gray-400">Status</span>
                        <span className="capitalize">
                          {order.status?.replaceAll("-", " ")}
                        </span>
                      </p>
                      <p>
                        <span className="block text-gray-400">Total</span>
                        NGN {order.totalPrice}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section ref={analyticsRef} className="scroll-mt-40 lg:scroll-mt-8">
            <DashboardAnalytics orders={orders} products={products} />
          </section>

          <section ref={productsRef} className="scroll-mt-40 lg:scroll-mt-8">
            <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-xl font-bold text-yellow-500 sm:text-2xl">
                  Products
                </h2>
                <p className="text-sm text-gray-400">
                  Review and update meals shown to buyers.
                </p>
              </div>
            </div>

            {products.length === 0 ? (
              <div className="rounded-xl border border-yellow-700 bg-[#2c1b12] p-6 text-gray-400">
                No products added yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {products.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    isVendor
                    onEdit={startEdit}
                    fetchProducts={fetchProducts}
                  />
                ))}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

export default VendorDashboard;
