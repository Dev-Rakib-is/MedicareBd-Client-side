import { useEffect, useState } from "react";
import { Wallet, Download, Calendar, ChevronDown } from "lucide-react";
import api from "../../api/api";

const DoctorPayroll = () => {
  const [payouts, setPayouts] = useState([]);
  const [filterMonth, setFilterMonth] = useState("");

  useEffect(() => {
    const fetchPayouts = async () => {
      try {
        const res = await api.get(
          `/doctor/payouts${filterMonth ? `?month=${filterMonth}` : ""}`
        );
        setPayouts(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchPayouts();
  }, [filterMonth]);

  return (
    <div className="mt-20 p-4 max-w-5xl mx-auto ">
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Wallet size={28} /> My Earnings
        </h1>

        <button className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700">
          <Download size={16} /> Download Report
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
        <div className="p-4 bg-green-100 rounded-md">
          <p className="font-bold text-lg">$ 12,000</p>
          <span className="text-sm text-gray-700">Total Earnings</span>
        </div>
        <div className="p-4 bg-yellow-100 rounded-md">
          <p className="font-bold text-lg">$ 2,200</p>
          <span className="text-sm text-gray-700">Pending Payout</span>
        </div>
        <div className="p-4 bg-blue-100 rounded-md">
          <p className="font-bold text-lg">$ 9,800</p>
          <span className="text-sm text-gray-700">Paid Amount</span>
        </div>
      </div>

      {/* Filter */}
      <div className="flex justify-end my-4">
        <div className="relative flex items-center border p-2 rounded-md bg-white">
          <Calendar size={18} className="text-gray-600" />
          <select
            className="ml-2 outline-none"
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
          >
            <option value="">All Months</option>
            <option value="01">January</option>
            <option value="02">February</option>
            <option value="03">March</option>
          </select>
          <ChevronDown size={18} />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">Date</th>
              <th className="p-3">Patient</th>
              <th className="p-3">Consultation Fee</th>
              <th className="p-3">Commission</th>
              <th className="p-3">You Get</th>
              <th className="p-3 text-center">Status</th>
            </tr>
          </thead>

          <tbody>
            {payouts.map((p, i) => (
              <tr key={i} className="border-b hover:bg-gray-50">
                <td className="p-3">{p.date}</td>
                <td className="p-3">{p.patient}</td>
                <td className="p-3">$ {p.fee}</td>
                <td className="p-3 text-red-600">-$ {p.commission}</td>
                <td className="p-3 font-bold text-green-700">
                  $ {p.fee - p.commission}
                </td>
                <td className="p-3 text-center">
                  {p.status === "Paid" ? (
                    <span className="bg-green-200 text-green-800 px-2 py-1 rounded-md">
                      Paid
                    </span>
                  ) : (
                    <span className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded-md">
                      Pending
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {payouts.length === 0 && (
        <p className="text-center mt-4 text-gray-600">No payout history found</p>
      )}
    </div>
  );
};

export default DoctorPayroll;
