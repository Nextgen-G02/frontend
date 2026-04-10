import React from "react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-pink-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-pink-600 text-white p-6">
        <h2 className="text-2xl font-bold mb-8">Admin Panel</h2>

        <nav className="space-y-4">
          <button className="block w-full text-left hover:bg-pink-700 p-2 rounded">
            Dashboard
          </button>

          <button className="block w-full text-left hover:bg-pink-700 p-2 rounded">
            Manage Products
          </button>

          <button className="block w-full text-left hover:bg-pink-700 p-2 rounded">
            Manage Orders
          </button>

          <button className="block w-full text-left hover:bg-pink-700 p-2 rounded">
            Manage Staff
          </button>

          <button
            onClick={handleLogout}
            className="block w-full text-left bg-red-500 hover:bg-red-600 p-2 rounded mt-8"
          >
            Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-pink-600 mb-4">
          Welcome, {user?.firstName} 👋
        </h1>

        <p className="text-gray-600 mb-8">
          Role: <span className="font-semibold">{user?.role}</span>
        </p>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white shadow-lg rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-700">
              Total Products
            </h3>
            <p className="text-3xl font-bold text-pink-500 mt-2">25</p>
          </div>

          <div className="bg-white shadow-lg rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-700">
              Total Orders
            </h3>
            <p className="text-3xl font-bold text-pink-500 mt-2">120</p>
          </div>

          <div className="bg-white shadow-lg rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-700">
              Staff Members
            </h3>
            <p className="text-3xl font-bold text-pink-500 mt-2">8</p>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="bg-white mt-8 p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-gray-700">
            Recent Activity
          </h2>

          <ul className="space-y-3 text-gray-600">
            <li>✔ New order placed by customer</li>
            <li>✔ Product "Chocolate Cake" updated</li>
            <li>✔ Staff member created</li>
          </ul>
        </div>
      </main>
    </div>
  );
}