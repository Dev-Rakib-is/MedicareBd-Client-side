import { useEffect, useState } from "react";
import api from "../api/api";
import PaymentTable from './../components/payment/PaymentTable';
import PaymentStats from './../components/payment/PaymentStats';
import PayoutModal from './../components/payment/PayoutModal';

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [stats, setStats] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const fetchPayments = async () => {
    const res = await api.get("/admin-payment");
    setPayments(res.data.payments || []);
  };

  const fetchStats = async () => {
    const res = await api.get("/admin-payment/stats");
    setStats(res.data);
  };

  useEffect(() => {
    fetchPayments();
    fetchStats();
  }, []);

  return (
    <div className="p-6 mt-16 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Payment Management</h1>

      {stats && <PaymentStats stats={stats} />}

      <PaymentTable
        payments={payments}
        refresh={fetchPayments}
        onPayout={(doctor) => setSelectedDoctor(doctor)}
      />

      {selectedDoctor && (
        <PayoutModal
          doctor={selectedDoctor}
          onClose={() => setSelectedDoctor(null)}
          onSuccess={() => {
            setSelectedDoctor(null);
            fetchStats();
          }}
        />
      )}
    </div>
  );
};

export default AdminPayments;
