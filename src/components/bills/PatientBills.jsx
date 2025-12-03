import { useEffect, useState } from "react";
import api from "../../api/api";

const PatientBills = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchBills = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/patient/bills"); 
      setBills(res.data.bills || []);
    } catch (err) {
      console.error("Bills Error:", err);
      setError(err.response?.data?.message || "Failed to load bills");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  if (loading)
    return <p className="mt-16 text-center">Loading Bills...</p>;

  if (error)
    return <p className="mt-16 text-center text-red-600">{error}</p>;

  return (
    <div className="mt-16 mx-auto max-w-4xl space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Billing History</h1>

        <button 
          className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          onClick={fetchBills}
        >
          Refresh
        </button>
      </div>

      {bills.length === 0 ? (
        <div className="text-center text-gray-600 py-10">
          No bills found.
        </div>
      ) : (
        <div className="border rounded-lg bg-white divide-y">
          {bills.map((bill) => (
            <div key={bill._id} className="flex items-center justify-between p-4">
              
              <div>
                <p className="font-semibold">
                  Dr. {bill.doctor?.name || "Doctor"}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(bill.date).toLocaleDateString()}
                </p>

                <p className="text-sm text-gray-500 mt-1">
                  Appointment ID: {bill.appointmentId}
                </p>
              </div>

              <div className="text-right">
                <p className="text-lg font-bold text-green-600">
                  ${bill.amount}
                </p>

                <span className={`text-sm py-1 px-2 rounded-full ${bill.status === "PAID"
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600"
                  }`}
                >
                  {bill.status}
                </span>

                {bill.invoiceUrl && (
                  <button
                    className="block mt-2 text-blue-600 underline"
                    onClick={() => window.open(bill.invoiceUrl)}
                  >
                    View Invoice
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientBills;
