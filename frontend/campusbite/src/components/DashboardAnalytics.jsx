import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

function DashboardAnalytics({ orders = [], products = [] }) {
  const totalRevenue = orders
    .filter((order) => order.status === "delivered")
    .reduce((acc, order) => acc + (order.totalPrice || 0), 0);

  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const preparingOrders = orders.filter((o) => o.status === "preparing").length;
  const deliveredOrders = orders.filter((o) => o.status === "delivered").length;

  const revenueData = {
    labels: ["Revenue"],
    datasets: [
      {
        label: "Delivered Revenue",
        data: [totalRevenue],
        backgroundColor: "#fbbf24",
      },
    ],
  };

  const revenueOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#f8fafc" },
      },
      y: {
        beginAtZero: true,
        ticks: { color: "#f8fafc" },
        grid: { color: "rgba(255,255,255,0.1)" },
      },
    },
  };

  const statusData = {
    labels: ["Pending", "Preparing", "Delivered"],
    datasets: [
      {
        data: [pendingOrders, preparingOrders, deliveredOrders],
        backgroundColor: ["#fbbf24", "#f97316", "#10b981"],
        hoverOffset: 8,
      },
    ],
  };

  const statusOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#f8fafc",
        },
      },
      tooltip: {
        enabled: true,
      },
    },
  };

  return (
    <div className="space-y-8">

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="bg-[#2c1b12] border border-yellow-700 rounded-2xl p-6">
          <h2 className="text-gray-400 mb-2">Revenue</h2>
          <p className="text-3xl font-bold text-yellow-500">₦{totalRevenue}</p>
        </div>

        <div className="bg-[#2c1b12] border border-yellow-700 rounded-2xl p-6">
          <h2 className="text-gray-400 mb-2">Orders</h2>
          <p className="text-3xl font-bold text-yellow-500">{totalOrders}</p>
        </div>

        <div className="bg-[#2c1b12] border border-yellow-700 rounded-2xl p-6">
          <h2 className="text-gray-400 mb-2">Pending</h2>
          <p className="text-3xl font-bold text-yellow-500">{pendingOrders}</p>
        </div>

        <div className="bg-[#2c1b12] border border-yellow-700 rounded-2xl p-6">
          <h2 className="text-gray-400 mb-2">Products</h2>
          <p className="text-3xl font-bold text-yellow-500">{products.length}</p>
        </div>
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="bg-[#2c1b12] border border-yellow-700 rounded-2xl p-6 h-105">
          <h2 className="text-2xl font-bold text-yellow-500 mb-6">Revenue Analytics</h2>
          <div className="h-85">
            <Bar data={revenueData} options={revenueOptions} />
          </div>
        </div>

        <div className="bg-[#2c1b12] border border-yellow-700 rounded-2xl p-6 h-105">
          <h2 className="text-2xl font-bold text-yellow-500 mb-6">Order Status</h2>
          <div className="h-85">
            <Pie data={statusData} options={statusOptions} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardAnalytics;

