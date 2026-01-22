import api from "../../api/api";
import { useState } from "react";

const PayoutModal = ({ doctor, onClose, onSuccess }) => {
  const [amount, setAmount] = useState("");

  const handlePayout = async () => {
    await api.post(`/admin/doctors/${doctor._id}/payout`, { amount });
    onSuccess();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">
          Payout to {doctor.name}
        </h2>

        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full border p-2 rounded mb-4"
        />

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
            Cancel
          </button>
          <button
            onClick={handlePayout}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            Confirm Payout
          </button>
        </div>
      </div>
    </div>
  );
};

export default PayoutModal;
