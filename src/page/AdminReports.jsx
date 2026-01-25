import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

const StatCard = ({ title, value }) => (
  <div className="p-4 rounded-xl shadow bg-background">
    <p className="text-sm text-muted-foreground">{title}</p>
    <p className="text-xl font-semibold mt-1">{value}</p>
  </div>
);

export default function AdminReports() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [range, setRange] = useState("30"); // 7 | 30

  const [revenueData, setRevenueData] = useState([]);
  const [appointmentData, setAppointmentData] = useState([]);
  const [summary, setSummary] = useState({});
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    setLoading(true);
    setError(null);

    // simulate backend fetch by range
    setTimeout(() => {
      try {
        setRevenueData(
          range === "7"
            ? [
                { month: "Mon", revenue: 12000 },
                { month: "Tue", revenue: 18000 },
                { month: "Wed", revenue: 22000 },
                { month: "Thu", revenue: 15000 },
                { month: "Fri", revenue: 26000 },
                { month: "Sat", revenue: 30000 },
                { month: "Sun", revenue: 28000 },
              ]
            : [
                { month: "Jan", revenue: 40000 },
                { month: "Feb", revenue: 55000 },
                { month: "Mar", revenue: 70000 },
                { month: "Apr", revenue: 62000 },
              ]
        );

        setAppointmentData([
          { name: "Completed", value: 120 },
          { name: "Pending", value: 35 },
          { name: "Cancelled", value: 20 },
        ]);

        setSummary({
          totalUsers: 2340,
          newUsers: range === "7" ? 28 : 120,
          doctors: 85,
        });

        setDoctors([
          { name: "Dr. Rahman", appointments: 45, earnings: 90000 },
          { name: "Dr. Ahmed", appointments: 38, earnings: 76000 },
          { name: "Dr. Karim", appointments: 32, earnings: 64000 },
        ]);

        setDepartments([
          { name: "Cardiology", appointments: 120 },
          { name: "Neurology", appointments: 80 },
          { name: "Orthopedics", appointments: 95 },
          { name: "Dermatology", appointments: 60 },
        ]);

        setLoading(false);
      } catch (e) {
        setError("Failed to load reports");
        setLoading(false);
      }
    }, 700);
  }, [range]);

  if (loading) return <div className="p-6">Loading reports...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Admin Reports</h1>
        <div className="flex gap-2">
          <Button
            variant={range === "7" ? "default" : "outline"}
            onClick={() => setRange("7")}
          >
            Last 7 Days
          </Button>
          <Button
            variant={range === "30" ? "default" : "outline"}
            onClick={() => setRange("30")}
          >
            Last 30 Days
          </Button>
        </div>
      </div>

      {/* Payment Reports */}
      <Card>
        <CardContent className="p-4">
          <h2 className="text-xl font-medium mb-3">Payment Reports</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={revenueData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Appointment Reports */}
      <Card>
        <CardContent className="p-4">
          <h2 className="text-xl font-medium mb-3">Appointment Reports</h2>
          <div className="grid grid-cols-3 gap-4">
            {appointmentData.map((item) => (
              <StatCard key={item.name} title={item.name} value={item.value} />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* User & Registration Reports */}
      <Card>
        <CardContent className="p-4">
          <h2 className="text-xl font-medium mb-3">User & Registration Reports</h2>
          <div className="grid grid-cols-3 gap-4">
            <StatCard title="Total Users" value={summary.totalUsers} />
            <StatCard title="New Users" value={summary.newUsers} />
            <StatCard title="Doctors" value={summary.doctors} />
          </div>
        </CardContent>
      </Card>

      {/* Doctor Performance Reports */}
      <Card>
        <CardContent className="p-4">
          <h2 className="text-xl font-medium mb-3">Doctor Performance Reports</h2>
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="p-2">Doctor</th>
                <th className="p-2">Appointments</th>
                <th className="p-2">Earnings</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((d) => (
                <tr key={d.name} className="border-b last:border-0">
                  <td className="p-2">{d.name}</td>
                  <td className="p-2">{d.appointments}</td>
                  <td className="p-2">৳{d.earnings.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Department Reports */}
      <Card>
        <CardContent className="p-4">
          <h2 className="text-xl font-medium mb-3">Department Reports</h2>
          <div className="grid grid-cols-4 gap-4">
            {departments.map((dep) => (
              <StatCard
                key={dep.name}
                title={dep.name}
                value={`${dep.appointments} Appts`}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Time-Based Reports */}
      <Card>
        <CardContent className="p-4">
          <h2 className="text-xl font-medium mb-3">Time-Based Trend Analysis</h2>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={revenueData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line dataKey="revenue" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Export & Utility */}
      <div className="flex gap-3">
        <Button>Export PDF</Button>
        <Button>Export Excel</Button>
        <Button variant="outline">Print</Button>
      </div>
    </div>
  );
}