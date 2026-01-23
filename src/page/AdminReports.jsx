import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

export default function AdminReports() {
  const [loading, setLoading] = useState(true);
  const [revenueData, setRevenueData] = useState([]);
  const [appointmentData, setAppointmentData] = useState([]);
  const [summary, setSummary] = useState({});

  useEffect(() => {
    // simulate backend fetch
    setTimeout(() => {
      setRevenueData([
        { month: "Jan", revenue: 40000 },
        { month: "Feb", revenue: 55000 },
        { month: "Mar", revenue: 70000 },
        { month: "Apr", revenue: 62000 },
      ]);

      setAppointmentData([
        { name: "Completed", value: 120 },
        { name: "Pending", value: 35 },
        { name: "Cancelled", value: 20 },
      ]);

      setSummary({
        totalUsers: 2340,
        newUsers: 120,
        doctors: 85,
      });

      setLoading(false);
    }, 800);
  }, []);

  if (loading) {
    return <div className="p-6">Loading reports...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Admin Reports</h1>
        <div className="flex gap-2">
          <Button variant="outline">Last 7 Days</Button>
          <Button variant="outline">Last 30 Days</Button>
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
              <div key={item.name} className="p-4 rounded-xl shadow">
                <p className="text-lg font-semibold">{item.value}</p>
                <p className="text-sm text-muted-foreground">{item.name}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* User & Registration Reports */}
      <Card>
        <CardContent className="p-4">
          <h2 className="text-xl font-medium mb-3">User & Registration Reports</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 rounded-xl shadow">Total Users: {summary.totalUsers}</div>
            <div className="p-4 rounded-xl shadow">New This Month: {summary.newUsers}</div>
            <div className="p-4 rounded-xl shadow">Doctors: {summary.doctors}</div>
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
              <tr>
                <td className="p-2">Dr. Rahman</td>
                <td className="p-2">45</td>
                <td className="p-2">৳90,000</td>
              </tr>
              <tr>
                <td className="p-2">Dr. Ahmed</td>
                <td className="p-2">38</td>
                <td className="p-2">৳76,000</td>
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Department Reports */}
      <Card>
        <CardContent className="p-4">
          <h2 className="text-xl font-medium mb-3">Department Reports</h2>
          <div className="grid grid-cols-4 gap-4">
            <div className="p-4 rounded-xl shadow">Cardiology: 120 Appts</div>
            <div className="p-4 rounded-xl shadow">Neurology: 80 Appts</div>
            <div className="p-4 rounded-xl shadow">Orthopedics: 95 Appts</div>
            <div className="p-4 rounded-xl shadow">Dermatology: 60 Appts</div>
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