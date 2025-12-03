// src/pages/BillsPage.jsx
import { useEffect, useState } from "react";
import api from "../api/api"; 

const STATUS_OPTIONS = ["All", "UNPAID", "PAID", "REFUNDED", "CANCELLED"];

const BillsPage = () => {
  const [bills, setBills] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch bills
  const fetchBills = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/bills/my");
      setBills(res.data.bills || []);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to fetch bills");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  const filteredBills =
    filter === "All"
      ? bills
      : bills.filter((b) => (b.status || "").toUpperCase() === filter);

  const downloadInvoice = (billId) => {
    // open invoice in new tab for download
    window.open(`/api/v1/bills/invoice/${billId}/download`, "_blank");
  };

  return (
    <div className="p-6 max-w-5xl mx-auto mt-16 space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Bills</h1>
          <p className="text-sm text-gray-600">
            View your bills and download invoices
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            className="border px-3 py-2 rounded-md"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <button
            onClick={fetchBills}
            className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Refresh
          </button>
        </div>
      </header>

      {loading ? (
        <div className="text-center py-20">Loading bills...</div>
      ) : error ? (
        <div className="text-center text-red-600">{error}</div>
      ) : filteredBills.length === 0 ? (
        <div className="text-center py-10 text-gray-600">No bills found.</div>
      ) : (
        <div className="space-y-4">
          {filteredBills.map((b) => (
            <article
              key={b._id}
              className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 border rounded-lg bg-white shadow-sm"
            >
              <div className="flex-1 space-y-1">
                <h3 className="font-semibold">
                  Appointment with Dr. {b.doctor?.name || "Unknown"}
                </h3>
                <p className="text-sm text-gray-600">
                  {b.appointment?.specialization || "General"} |{" "}
                  {new Date(b.appointment?.date).toLocaleDateString()} •{" "}
                  {b.appointment?.timeSlot || "Time not set"}
                </p>
                <p className="text-sm text-gray-600">
                  Amount: {b.amount} {b.currency || "USD"}
                </p>
                <p className="text-sm text-gray-600">Notes: {b.notes || "-"}</p>
              </div>

              <div className="flex items-center gap-3">
                <StatusBadge status={b.status} />

                <button
                  onClick={() => downloadInvoice(b._id)}
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-500"
                >
                  Download Invoice
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default BillsPage;

// Status Badge helper
const StatusBadge = ({ status }) => {
  const s = (status || "").toUpperCase();
  const classes =
    s === "UNPAID"
      ? "bg-orange-100 text-orange-800"
      : s === "PAID"
      ? "bg-green-100 text-green-800"
      : s === "REFUNDED"
      ? "bg-blue-100 text-blue-800"
      : s === "CANCELLED"
      ? "bg-red-100 text-red-800"
      : "bg-gray-100 text-gray-800";

  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-medium ${classes}`}
    >
      {s || "Unknown"}
    </span>
  );
};
