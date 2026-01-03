// src/components/AppointmentConfirmed.jsx
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../api/api';

function AppointmentConfirmed() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [appointment, setAppointment] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setUser(storedUser);
  }, []);

  // Appointment details fetch করার function
  const fetchAppointmentDetails = async () => {
    try {
      setLoading(true);
      console.log('Fetching appointment with ID:', id);
      
      const response = await api.get(`/appointments/${id}`);
      console.log('API Response:', response.data);

      if (response.data.success) {
        setAppointment(response.data.appointment);
        setError(null);
      } else {
        throw new Error(response.data.message || 'Failed to fetch appointment');
      }
    } catch (err) {
      console.error('Error fetching appointment:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Network error';
      setError(errorMessage);
      console.log('Error details:', err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  // Cancel appointment function
  const handleCancelAppointment = async () => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) {
      return;
    }

    try {
      const response = await api.patch(
        '/appointments/patient/cancel',
        { appointmentId: id }
      );

      if (response.data.success) {
        alert('Appointment cancelled successfully');
        fetchAppointmentDetails(); // Refresh data
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel appointment');
    }
  };

  // Update payment status function
  const handleUpdatePayment = async () => {
    const transactionId = prompt('Enter your transaction ID:');
    if (!transactionId) return;

    try {
      const response = await api.patch(
        `/appointments/${id}/payment`,
        {
          paymentStatus: 'PAID',
          transactionId: transactionId
        }
      );

      if (response.data.success) {
        alert('Payment status updated successfully');
        fetchAppointmentDetails(); // Refresh data
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update payment');
    }
  };

  // Component mount হলে ডেটা fetch
  useEffect(() => {
    fetchAppointmentDetails();
  }, [id]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-6 text-gray-700 text-lg">Loading appointment details...</p>
        </div>
      </div>
    );
  }

  // Error state - Debugging সহ
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="max-w-md bg-white p-8 rounded-2xl shadow-xl">
          <div className="text-red-600 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Appointment</h2>
          <p className="text-gray-600 mb-2">{error}</p>
          <p className="text-sm text-gray-500 mb-4">
            Appointment ID: {id}
          </p>
          <div className="space-y-3">
            <button
              onClick={fetchAppointmentDetails}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Try Again
            </button>
            <button
              onClick={() => {
                // Temporary fallback data for testing
                setAppointment({
                  _id: id,
                  patient: { name: "Test Patient", email: "test@example.com" },
                  doctor: { name: "Dr. Test Doctor", specialization: "General", fee: 500 },
                  date: new Date().toISOString().split('T')[0],
                  timeSlot: "10:00 AM",
                  status: "PENDING",
                  payment: { status: "UNPAID", amount: 500, method: "CASH" },
                  reason: "General Checkup",
                  createdAt: new Date().toISOString()
                });
                setError(null);
              }}
              className="w-full bg-yellow-600 text-white py-3 rounded-lg font-semibold hover:bg-yellow-700 transition"
            >
              Use Demo Data (Testing)
            </button>
            <Link
              to="/dashboard"
              className="block w-full bg-gray-600 text-white py-3 rounded-lg font-semibold text-center hover:bg-gray-700 transition"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Appointment না পেলে
  if (!appointment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="max-w-md bg-white p-8 rounded-2xl shadow-xl text-center">
          <div className="text-gray-500 text-5xl mb-4">📋</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Appointment Not Found</h2>
          <p className="text-gray-600 mb-6">The appointment you're looking for doesn't exist.</p>
          <Link
            to="/"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  // Status এর উপর ভিত্তি করে colors
  const statusColors = {
    'PENDING': 'bg-yellow-100 text-yellow-800 border-yellow-300',
    'ACCEPTED': 'bg-green-100 text-green-800 border-green-300',
    'REJECTED': 'bg-red-100 text-red-800 border-red-300',
    'CANCELLED': 'bg-gray-100 text-gray-800 border-gray-300',
    'COMPLETED': 'bg-blue-100 text-blue-800 border-blue-300'
  };

  // Payment status colors
  const paymentColors = {
    'UNPAID': 'bg-red-100 text-red-800 border-red-300',
    'PAID': 'bg-green-100 text-green-800 border-green-300',
    'PENDING': 'bg-yellow-100 text-yellow-800 border-yellow-300',
    'REFUNDED': 'bg-blue-100 text-blue-800 border-blue-300'
  };

  // Payment method icons
  const paymentIcons = {
    'CASH': '💰',
    'BKASH': '📱',
    'NAGAD': '📱',
    'ROCKET': '📱',
    'CARD': '💳',
    'STRIPE': '💳',
    'SSLCOMMERZ': '💳',
    'ONLINE': '🌐'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header with navigation */}
        <div className="flex justify-between items-center mb-8">
          <Link
            to={user?.role === 'PATIENT' ? '/dashboard' : '/'}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <span className="mr-2">←</span> Back
          </Link>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Logged in as: {user?.name}</span>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${user?.role === 'PATIENT' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
              {user?.role}
            </span>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-green-600 p-6 md:p-8 text-white">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold mb-2">
                  Appointment Confirmation
                </h1>
                <p className="text-blue-100 opacity-90">
                  {new Date(appointment.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <div className={`px-4 py-2 rounded-lg font-bold ${statusColors[appointment.status]}`}>
                  {appointment.status}
                </div>
              </div>
            </div>
          </div>

          {/* Appointment Details */}
          <div className="p-6 md:p-8">
            
            {/* Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              
              {/* Patient & Doctor Info */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Appointment Information</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mr-4">
                        <span className="text-blue-600">👤</span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Patient Name</p>
                        <p className="font-semibold text-gray-800">{appointment.patient?.name}</p>
                        <p className="text-sm text-gray-600">{appointment.patient?.email}</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center mr-4">
                        <span className="text-green-600">👨‍⚕️</span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Doctor</p>
                        <p className="font-semibold text-gray-800">{appointment.doctor?.name}</p>
                        <p className="text-sm text-gray-600">{appointment.doctor?.specialization}</p>
                        <p className="text-sm text-gray-600">Fee: $ {appointment.doctor?.fee} USD</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Appointment Time */}
                <div className="bg-gray-50 rounded-xl p-5">
                  <div className="flex items-center mb-3">
                    <span className="text-gray-700 mr-3">📅</span>
                    <div>
                      <p className="font-semibold text-gray-800">Date & Time</p>
                      <p className="text-gray-700">
                        {new Date(appointment.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                      <p className="text-lg font-bold text-gray-900">
                        {appointment.timeSlot} • {appointment.duration || 15} minutes
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment & Status */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Details</h3>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Status:</span>
                      <div className={`px-3 py-1 rounded-full text-sm font-semibold ${paymentColors[appointment.payment?.status]}`}>
                        {appointment.payment?.status || 'UNPAID'}
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Method:</span>
                      <div className="flex items-center">
                        <span className="mr-2">{paymentIcons[appointment.payment?.method] || '💸'}</span>
                        <span className="font-semibold">{appointment.payment?.method || 'Not specified'}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-bold text-lg text-gray-900">
                        ৳{appointment.payment?.amount || appointment.doctor?.fee || 0}
                      </span>
                    </div>

                    {appointment.payment?.transactionId && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Transaction ID:</span>
                        <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                          {appointment.payment.transactionId}
                        </span>
                      </div>
                    )}

                    {appointment.payment?.paymentDate && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Paid on:</span>
                        <span className="text-sm">
                          {new Date(appointment.payment.paymentDate).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Appointment Details */}
                <div className="bg-blue-50 rounded-xl p-5">
                  <h4 className="font-semibold text-blue-800 mb-3">Appointment Notes</h4>
                  <p className="text-blue-700">{appointment.reason || 'General Consultation'}</p>
                  {appointment.notes && (
                    <p className="text-blue-700 mt-2">{appointment.notes}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons - Patient Only */}
            {user?.role === 'PATIENT' && appointment.status !== 'CANCELLED' && appointment.status !== 'COMPLETED' && (
              <div className="border-t pt-8 mt-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-6">Manage Appointment</h3>
                <div className="flex flex-col sm:flex-row gap-4">
                  {appointment.payment?.status === 'UNPAID' && (
                    <button
                      onClick={handleUpdatePayment}
                      className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold py-3 px-6 rounded-lg hover:from-green-700 hover:to-green-800 transition shadow-md"
                    >
                      Mark as Paid
                    </button>
                  )}
                  
                  {['PENDING', 'ACCEPTED'].includes(appointment.status) && (
                    <>
                      <button
                        onClick={handleCancelAppointment}
                        className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold py-3 px-6 rounded-lg hover:from-red-700 hover:to-red-800 transition shadow-md"
                      >
                        Cancel Appointment
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
            {/* Footer Links */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex flex-wrap justify-center gap-6">
                <button
                  onClick={() => window.print()}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Print Confirmation
                </button>
                <Link
                  to="/dashboard"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Go to Dashboard
                </Link>
                {user?.role === 'PATIENT' && (
                  <Link
                    to="/patient/appointments"
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    View All Appointments
                  </Link>
                )}
                {user?.role === 'DOCTOR' && (
                  <Link
                    to="/doctor/appointments"
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Doctor Dashboard
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Info */}
        <div className="mt-8 text-center text-gray-600 text-sm">
          <p>Appointment ID: <span className="font-mono">{appointment._id}</span></p>
          <p className="mt-1">Created on: {new Date(appointment.createdAt).toLocaleString()}</p>
          <p className="mt-2">For any queries, please contact our support team</p>
        </div>
      </div>
    </div>
  );
}

export default AppointmentConfirmed;