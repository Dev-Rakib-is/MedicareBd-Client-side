import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, Clock, Check, CreditCard } from 'lucide-react';
import api from '../api/api';

const BookAppointment = ({ user }) => {
  const { doctorId } = useParams(); 
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedTime, setSelectedTime] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    notes: '',
    paymentMethod: 'Card',
  });
  const [loading, setLoading] = useState(false);
  const [doctor, setDoctor] = useState(null); 

  // Autofill login info
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || ''
      }));
    }
  }, [user]);

  // Fetch doctor info
  useEffect(() => {
    const fetchDoctor = async () => {
      if (!doctorId) return;
      try {
        const res = await api.get(`/doctors/${doctorId}`);
        setDoctor(res.data.doctor);
      } catch (err) {
        console.error("Failed to fetch doctor info", err);
      }
    };
    fetchDoctor();
  }, [doctorId]);

  // Fetch available slots whenever date changes
  useEffect(() => {
    const fetchSlots = async () => {
      if (!selectedDate || !doctorId) return;
      try {
        const token = localStorage.getItem('token');
        // ✅ সঠিক এন্ডপয়েন্ট ব্যবহার করুন
        const res = await api.get(`/doctors/${doctorId}/available-slots`, {
          params: { date: selectedDate },
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // ✅ ব্যাকএন্ডের রেসপন্স অনুযায়ী স্লট সেট করুন
        setAvailableSlots(res.data.slots || res.data.availableSlots || []); 
      } catch (err) {
        console.error(err);
        setAvailableSlots([]);
      }
    };
    fetchSlots();
  }, [selectedDate, doctorId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => { if(step < 5) setStep(step + 1); };
  const handleBack = () => { if(step > 1) setStep(step - 1); };

  const isStepValid = () => {
    switch(step) {
      case 1: return selectedDate;
      case 2: return selectedTime;
      case 3: return formData.name && formData.email && formData.phone;
      case 4: return formData.paymentMethod;
      default: return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // ✅ FIXED: Backend-এর expected payload structure
      const payload = {
        doctorId: doctorId, // ✅ এখানে doctorId পাঠানো দরকার
        date: selectedDate,
        timeSlot: selectedTime, // ✅ timeSlot নামে পাঠাতে হবে
        patientName: formData.name,
        patientEmail: formData.email,
        patientPhone: formData.phone,
        notes: formData.notes
      };

      const token = localStorage.getItem('token');
      const response = await api.post(`/appointments`, payload, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        alert('Appointment booked successfully!');
        
        // ✅ সফল হলে appointment ID সহ confirmation পেইজে redirect
        const appointmentId = response.data.appointment?._id;
        if (appointmentId) {
          window.location.href = `/appointment-confirmed/${appointmentId}`;
        }

        // Reset form
        setSelectedDate('');
        setSelectedTime('');
        setFormData({ 
          name: '', 
          email: '', 
          phone: '', 
          notes: '', 
          paymentMethod: 'CASH' 
        });
        setAvailableSlots([]);
        setStep(1);
      } else {
        throw new Error(response.data.message || 'Booking failed');
      }

    } catch (err) {
      console.error('❌ Appointment booking error:', err);
      alert(err.response?.data?.message || err.message || 'Failed to book appointment');
    } finally { 
      setLoading(false); 
    }
  };

  // Generate next 7 days
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return {
      full: date.toISOString().split('T')[0],
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      date: date.getDate(),
      month: date.toLocaleDateString('en-US', { month: 'short' })
    };
  });

  // ✅ Helper: Doctor specialization name get
  const getSpecializationName = (spec) => {
    if (!spec) return "Doctor";
    if (typeof spec === 'object') {
      return spec.name || "Doctor";
    }
    return spec;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4">
      <div className="max-w-6xl mx-auto mt-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Book Your Appointment</h1>
          {doctor && (
            <div className="inline-flex items-center gap-4 bg-white p-4 rounded-lg shadow">
              <div className="text-left">
                <h2 className="font-bold text-lg">{doctor.name}</h2>
                <p className="text-blue-600">
                  {getSpecializationName(doctor.specialization)}
                </p>
                <p className="text-gray-600 text-sm">
                  Fee: ${doctor.fee || 0} • Rating: ⭐{doctor.rating || 4.5}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="md:flex">
            {/* Left Panel */}
            <div className="md:w-1/3 bg-gradient-to-b from-blue-900 to-indigo-900 text-white p-8">
              <div className="mb-12 flex justify-between">
                {[1,2,3,4,5].map((stepNum) => (
                  <div key={stepNum} className="flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${step >= stepNum ? 'bg-blue-500' : 'bg-white/20'}`}>
                      {step > stepNum ? <Check className="w-6 h-6" /> : <span className="font-semibold">{stepNum}</span>}
                    </div>
                    <span className="text-sm">{['Date','Time','Details','Payment','Confirm'][stepNum-1]}</span>
                  </div>
                ))}
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8">
                <h3 className="font-semibold text-lg mb-4">Appointment Summary</h3>
                <div className="space-y-3">
                  {doctor && (
                    <div className="flex justify-between">
                      <span className="text-blue-200">Doctor</span>
                      <span className="font-medium">{doctor.name}</span>
                    </div>
                  )}
                  {selectedDate && (
                    <div className="flex justify-between">
                      <span className="text-blue-200">Date</span>
                      <span className="font-medium">
                        {new Date(selectedDate).toLocaleDateString('en-US', { 
                          weekday: 'short', 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </span>
                    </div>
                  )}
                  {selectedTime && (
                    <div className="flex justify-between">
                      <span className="text-blue-200">Time</span>
                      <span className="font-medium">{selectedTime}</span>
                    </div>
                  )}
                  {doctor && (
                    <div className="flex justify-between">
                      <span className="text-blue-200">Fee</span>
                      <span className="font-medium">${doctor.fee || 0}</span>
                    </div>
                  )}
                  {formData.paymentMethod && (
                    <div className="flex justify-between">
                      <span className="text-blue-200">Payment</span>
                      <span className="font-medium">{formData.paymentMethod}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Panel */}
            <div className="md:w-2/3 p-8">
              <form onSubmit={handleSubmit}>
                {/* Step 1: Date */}
                {step===1 && (
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Select Appointment Date</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {dates.map(d=>(
                        <button 
                          type="button" 
                          key={d.full} 
                          onClick={()=>setSelectedDate(d.full)}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            selectedDate===d.full
                              ? 'border-blue-500 bg-blue-50 shadow-lg' 
                              : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                          }`}
                        >
                          <div className="text-center">
                            <p className="text-gray-600 text-sm">{d.day}</p>
                            <p className="text-2xl font-bold text-gray-900 my-2">{d.date}</p>
                            <p className="text-gray-700">{d.month}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 2: Time */}
                {step===2 && (
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Select Time Slot</h3>
                    {availableSlots.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {availableSlots.map(slot => (
                          <button 
                            type="button" 
                            key={slot.time || slot} 
                            onClick={() => setSelectedTime(slot.time || slot)}
                            className={`p-4 rounded-xl border-2 transition-all ${
                              selectedTime === (slot.time || slot)
                                ? 'border-blue-500 bg-blue-50 shadow-lg' 
                                : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                            }`}
                          >
                            <div className="text-center">
                              <Clock className="w-6 h-6 mx-auto mb-2 text-gray-700" />
                              <span className="font-medium text-gray-900">{slot.time || slot}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Clock className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-500 text-lg">
                          {selectedDate 
                            ? "No available slots for selected date. Please choose another date."
                            : "Please select a date first to see available time slots."
                          }
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Step 3: Details */}
                {step===3 && (
                  <div>
                    <h3 className="text-xl font-semibold mb-6">Your Details</h3>
                    <div className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                          <input 
                            type="text" 
                            name="name" 
                            value={formData.name} 
                            onChange={handleInputChange} 
                            placeholder="Your full name"
                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                          <input 
                            type="tel" 
                            name="phone" 
                            value={formData.phone} 
                            onChange={handleInputChange} 
                            placeholder="Your phone number"
                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                        <input 
                          type="email" 
                          name="email" 
                          value={formData.email} 
                          onChange={handleInputChange} 
                          placeholder="Your email address"
                          className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
                        <textarea 
                          name="notes" 
                          value={formData.notes} 
                          onChange={handleInputChange} 
                          placeholder="Any specific symptoms or notes for the doctor..."
                          className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-32"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: Payment */}
                {step===4 && (
                  <div>
                    <h3 className="text-xl font-semibold mb-6">Payment Method</h3>
                    <div className="space-y-4">
                      <label className="font-medium text-gray-700 flex items-center gap-2 mb-4">
                        <CreditCard className="w-5 h-5"/> Select Payment Method
                      </label>
                      <select 
                        name="paymentMethod" 
                        value={formData.paymentMethod} 
                        onChange={handleInputChange} 
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="CASH">Cash (Pay at clinic)</option>
                        <option value="CARD">Credit/Debit Card</option>
                        <option value="BKASH">bKash</option>
                        <option value="NAGAD">Nagad</option>
                        <option value="ROCKET">Rocket</option>
                        <option value="ONLINE">Online Payment</option>
                      </select>
                      
                      {/* Payment Note */}
                      <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-sm text-yellow-800">
                          {formData.paymentMethod === 'CASH' 
                            ? 'You will pay the consultation fee at the clinic reception.'
                            : 'You will be redirected to payment gateway after confirmation.'
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 5: Confirmation (if needed) */}
                {step===5 && (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Check className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Confirm Appointment</h3>
                    <p className="text-gray-600 mb-8">
                      Please review your appointment details and confirm to book.
                    </p>
                  </div>
                )}

                {/* Navigation */}
                <div className="flex justify-between mt-12 pt-8 border-t border-gray-200">
                  <button 
                    type="button" 
                    onClick={handleBack} 
                    disabled={step===1}
                    className={`px-8 py-3 rounded-lg font-medium ${
                      step===1 
                        ? 'text-gray-400 cursor-not-allowed' 
                        : 'text-gray-700 hover:bg-gray-100 border border-gray-300'
                    }`}
                  >
                    Back
                  </button>
                  
                  {step < 5 ? (
                    <button 
                      type="button" 
                      onClick={handleNext} 
                      disabled={!isStepValid()}
                      className={`px-8 py-3 rounded-lg font-medium ${
                        isStepValid() 
                          ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                          : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {step === 4 ? 'Review & Confirm' : 'Continue'}
                    </button>
                  ) : (
                    <button 
                      type="submit" 
                      disabled={loading}
                      className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium"
                    >
                      {loading ? 'Booking...' : 'Confirm Appointment'}
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;