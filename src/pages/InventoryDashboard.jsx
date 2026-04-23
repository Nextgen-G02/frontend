import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
  Package,
  RefreshCw,
  AlertTriangle,
  Settings,
  Activity,
  ArrowUpRight,
  ShieldCheck,
  Loader2
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const InventoryDashboard = () => {
  const navigate = useNavigate();
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/inventory`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setInventory(response.data.data);
    } catch (error) {
      toast.error("Failed to load registry");
    } finally {
      setLoading(false);
    }
  };

  const updateThreshold = async (id, newLevel) => {
    try {
      const token = localStorage.getItem("token");

      await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/api/inventory/${id}/threshold`,
        { lowStockLevel: parseInt(newLevel) },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Safety threshold updated");
      fetchInventory();
    } catch (error) {
      toast.error("Update failed");
    }
  };

  const handleSync = async () => {
    try {
      setSyncing(true);
      const token = localStorage.getItem("token");

      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/inventory/sync`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      toast.success("Registry synchronized");
      fetchInventory();
    } catch (error) {
      toast.error("Synchronization failed");
    } finally {
      setSyncing(false);
    }
  };



  return (
    <div className="space-y-10 max-w-[1500px] mx-auto">
      
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Inventory Dashboard</h1>

        <button
          onClick={handleSync}
          disabled={syncing}
          className="px-6 py-3 bg-black text-white rounded-lg flex items-center gap-2"
        >
          <RefreshCw className={syncing ? "animate-spin" : ""} size={18} />
          {syncing ? "Syncing..." : "Sync"}
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="p-6 bg-white shadow rounded-xl">
          <Activity />
          <p>Total Items</p>
          <h2 className="text-3xl font-bold">{inventory.length}</h2>
        </div>

        <div className="p-6 bg-white shadow rounded-xl">
          <AlertTriangle />
          <p>Low Stock</p>
          <h2 className="text-3xl font-bold">
            {inventory.filter(i => i.quantity <= i.lowStockLevel).length}
          </h2>
        </div>

        <div className="p-6 bg-black text-white shadow rounded-xl">
          <ShieldCheck />
          <p>System Health</p>
          <h2 className="text-3xl font-bold">94%</h2>
        </div>

      </div>

      {/* TABLE */}
      <div className="bg-white shadow rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">Item</th>
              <th className="p-4">Qty</th>
              <th className="p-4">Threshold</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="text-center p-10">
                  <Loader2 className="animate-spin mx-auto" />
                </td>
              </tr>
            ) : inventory.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center p-10">
                  No Data
                </td>
              </tr>
            ) : (
              inventory.map(item => {
                const isLow = item.quantity <= item.lowStockLevel;

                return (
                  <tr key={item._id} className="border-t">
                    <td className="p-4">
                      {item.productId?.pName || "No Name"}
                    </td>

                    <td className="p-4">{item.quantity}</td>

                    <td className="p-4">
                      <input
                        type="number"
                        defaultValue={item.lowStockLevel}
                        onBlur={(e) =>
                          updateThreshold(item._id, e.target.value)
                        }
                        className="border p-2 rounded"
                      />
                    </td>

                    <td className="p-4">
                      {isLow ? (
                        <span className="text-red-500">Low</span>
                      ) : (
                        <span className="text-green-500">OK</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryDashboard;