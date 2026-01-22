import api from "../../api/api";

const PaymentTable = ({ payments, refresh, onPayout }) => {
  const updateStatus = async (id, status) => {
    await api.patch(`/admin/payments/${id}/status`, { status });
    refresh();
  };

  const refundPayment = async (id) => {
    await api.post(`/admin/payments/${id}/refund`);
    refresh();
  };

  return (
    <div className="bg-white rounded-xl shadow overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3">Patient</th>
            <th className="p-3">Doctor</th>
            <th className="p-3">Amount</th>
            <th className="p-3">Method</th>
            <th className="p-3">Status</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((p) => (
            <tr key={p._id} className="border-t">
              <td className="p-3">{p.user?.name}</td>
              <td className="p-3">{p.doctor?.name}</td>
              <td className="p-3">৳{p.amount}</td>
              <td className="p-3">{p.method}</td>
              <td className="p-3">
                <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm">
                  {p.status}
                </span>
              </td>
              <td className="p-3 flex gap-2">
                {p.status === "PENDING" && (
                  <button
                    onClick={() => updateStatus(p._id, "PAID")}
                    className="bg-green-500 text-white px-3 py-1 rounded"
                  >
                    Mark Paid
                  </button>
                )}
                {p.status === "PAID" && (
                  <>
                    <button
                      onClick={() => refundPayment(p._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Refund
                    </button>
                    <button
                      onClick={() => onPayout(p.doctor)}
                      className="bg-indigo-500 text-white px-3 py-1 rounded"
                    >
                      Payout
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentTable;
