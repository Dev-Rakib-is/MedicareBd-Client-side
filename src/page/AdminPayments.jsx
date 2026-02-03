import { useEffect, useState } from "react";
import api from "../api/api";

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* ================= FUNCTIONS ================= */

  const updateStatus = async (paymentId, status) => {
    try {
      await api.patch(`/payments/payments/${paymentId}/status`, { status });
      loadPayments();
      loadStats();
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const refundPayment = async (paymentId) => {
    if (!confirm("Are you sure you want to refund this payment?")) return;

    try {
      await api.post(`/payments/payments/${paymentId}/refund`);
      loadPayments();
      loadStats();
    } catch (err) {
      console.error("Failed to refund:", err);
    }
  };

  /* ================= FETCH DATA ================= */

  const loadPayments = async () => {
    try {
      setLoading(true);
      const res = await api.get("/payments/payments");
      setPayments(res.data.payments || []);
    } catch (err) {
      setError("Failed to load payments");
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const res = await api.get("/payments/payments/stats");
      setStats(res.data);
    } catch (err) {
      console.error(err);
      setStats(null);
    }
  };

  useEffect(() => {
    loadPayments();
    loadStats();
  }, []);

  if (loading) return <div className="p-6">Loading payments...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Admin Payments</h1>
        <span className="text-sm text-gray-500">
          Total Payments: {payments.length}
        </span>
      </div>

      {/* STATS */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border rounded-lg p-4 shadow-sm">
            <p className="text-sm text-gray-500">Total Revenue</p>
            <p className="text-2xl font-bold">৳ {stats.totalRevenue}</p>
          </div>

          <div className="border rounded-lg p-4 shadow-sm">
            <p className="text-sm text-gray-500">Total Paid</p>
            <p className="text-2xl font-bold">৳ {stats.totalPaid}</p>
          </div>

          <div className="border rounded-lg p-4 shadow-sm">
            <p className="text-sm text-gray-500">Pending</p>
            <p className="text-2xl font-bold">৳ {stats.totalPending}</p>
          </div>
        </div>
      )}

      {/* TABLE */}
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-left">
          <thead className="border-b bg-gray-100">
            <tr>
              <th className="p-3">Patient</th>
              <th className="p-3">Doctor</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Method</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {payments.length === 0 && (
              <tr>
                <td colSpan="6" className="p-6 text-center text-gray-500">
                  No payments found
                </td>
              </tr>
            )}

            {payments.map((p) => (
              <tr key={p._id} className="border-b hover:bg-gray-50">
                <td className="p-3">{p.patient?.name || "N/A"}</td>
                <td className="p-3">{p.doctor?.name || "N/A"}</td>
                <td className="p-3">৳ {p.amount}</td>
                <td className="p-3">{p.method}</td>
                <td className="p-3 font-medium">{p.status}</td>

                <td className="p-3 text-right space-x-2">
                  {p.status !== "PAID" && (
                    <button
                      onClick={() => updateStatus(p._id, "PAID")}
                      className="px-3 py-1 text-sm rounded bg-blue-600 text-white hover:bg-blue-700"
                    >
                      Mark Paid
                    </button>
                  )}

                  {p.status === "PAID" && (
                    <button
                      onClick={() => refundPayment(p._id)}
                      className="px-3 py-1 text-sm rounded bg-red-600 text-white hover:bg-red-700"
                    >
                      Refund
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
