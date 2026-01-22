const PaymentStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <StatCard title="Total Revenue" value={`৳${stats.totalRevenue}`} />
      <StatCard title="Platform Income" value={`৳${stats.platformIncome}`} />
      <StatCard title="Doctor Paid" value={`৳${stats.doctorPaid}`} />
      <StatCard title="Pending Payout" value={`৳${stats.pendingPayout}`} />
    </div>
  );
};

const StatCard = ({ title, value }) => (
  <div className="bg-white p-5 rounded-xl shadow">
    <p className="text-gray-500 text-sm">{title}</p>
    <h2 className="text-2xl font-bold mt-1">{value}</h2>
  </div>
);

export default PaymentStats;
