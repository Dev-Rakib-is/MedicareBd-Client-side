import React, { useState, useEffect, useRef } from 'react'; // 🔥 React, useRef যোগ করুন
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
    paymentMethod: 'CASH',
  });
  const [loading, setLoading] = useState(false);
  const [doctor, setDoctor] = useState(null);
  const formRef = useRef(null); // 🔥 React.useRef থেকে useRef করুন

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
        
        // Generate time slots based on doctor's working hours AND slotDuration
        generateTimeSlots(res.data.doctor);
      } catch (err) {
        console.error("Failed to fetch doctor info", err);
      }
    };
    fetchDoctor();
  }, [doctorId]);

  // Generate time slots based on doctor's working hours AND slotDuration
  const generateTimeSlots = (doctorData) => {
    if (!doctorData || !doctorData.workingHours) return;
    
    const fromHour = parseInt(doctorData.workingHours.from || "9");
    const toHour = parseInt(doctorData.workingHours.to || "5");
    const slotDuration = doctorData.slotDuration || 15; // 🔥 Database থেকে slotDuration নিন
    
    console.log("Doctor slot duration:", slotDuration, "minutes");
    
    // 🔥 **YOUR DATABASE FORMAT**: from=9, to=5 (means 9 AM to 5 PM)
    let startHour = fromHour;
    let endHour = toHour;
    
    // If end hour is less than start hour, it's PM time
    if (endHour < startHour) {
      endHour += 12; // 5 -> 17 (5:00 PM)
    }
    
    const slots = [];
    
    // Convert hours to minutes for calculation
    const totalWorkingMinutes = (endHour - startHour) * 60;
    const numberOfSlots = totalWorkingMinutes / slotDuration;
    
    for (let i = 0; i < numberOfSlots; i++) {
      const slotMinutes = startHour * 60 + (i * slotDuration);
      const hour = Math.floor(slotMinutes / 60);
      const minute = slotMinutes % 60;
      
      // Format: 9:00, 9:15, 9:30, 9:45, 10:00, etc.
      const timeString = `${hour}:${minute.toString().padStart(2, '0')}`;
      slots.push(timeString);
    }
    
    console.log(`Generated ${slots.length} slots with ${slotDuration} minutes interval`);
    setAvailableSlots(slots);
  };

  // When date changes, regenerate slots
  useEffect(() => {
    if (doctor) {
      generateTimeSlots(doctor);
    }
  }, [selectedDate, doctor]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => { 
    if (step < 5) {
      setStep(step + 1); 
    }
  };

  const handleBack = () => { 
    if (step > 1) {
      setStep(step - 1); 
    }
  };

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
    
    // 🔥 শুধুমাত্র Step 5-এ থাকলে Submit করতে দিবে
    if (step !== 5) {
      console.log(`Form submission blocked at step ${step}. Only allowed at step 5.`);
      return;
    }
    
    setLoading(true);
    try {
      // ✅ ডাটাবেজ ফরম্যাট অনুযায়ী payload তৈরি করুন
      const payload = {
        doctorId: doctorId,
        date: selectedDate,
        timeSlot: selectedTime, // "9:00", "9:15", "9:30" format এ পাঠাবেন
        reason: formData.notes || "General Consultation",
        notes: formData.notes || "",
        paymentMethod: formData.paymentMethod,
        patientCountry: user?.country || "Bangladesh"
      };

      // Mobile banking হলে transaction ID যোগ করুন
      if (["BKASH", "NAGAD", "ROCKET"].includes(formData.paymentMethod)) {
        payload.transactionId = "TRX_" + Date.now();
      }

      console.log("Sending payload:", payload);

      const token = localStorage.getItem('token');
      const response = await api.post(`/appointments`, payload, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        alert('Appointment booked successfully!');
        
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
      console.error('❌ Appointment booking error details:');
      console.error('Status:', err.response?.status);
      console.error('Error data:', err.response?.data);
      console.error('Full error:', err);
      
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.errors?.join(', ') || 
                          err.message || 
                          "Failed to book appointment";
      
      alert(`Error: ${errorMessage}`);
    } finally { 
      setLoading(false); 
    }
  };

  // 🔥 Enter key press handle করার জন্য
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Enter key-এর default behavior বন্ধ করুন
      
      if (step < 5) {
        handleNext(); // Enter প্রেস করলে Next step এ যাবে
      } else if (step === 5) {
        // শুধুমাত্র Step 5-এ Enter প্রেস করলে Submit হবে
        // কিন্তু user নিজে ক্লিক করবে
      }
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

  // Helper to format time for display
  const formatTimeDisplay = (time) => {
    const [hour, minute] = time.split(':').map(Number);
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
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
                  {doctor.specialization?.name || doctor.specialization || "Doctor"}
                </p>
                <p className="text-gray-600 text-sm">
                  Fee: ৳{doctor.fee || 0} • Rating: ⭐{doctor.rating || 4.5}
                </p>
                <p className="text-gray-600 text-sm mt-1">
                  Working: {doctor.workingHours?.from || "9"}:00 - {doctor.workingHours?.to || "5"}:00
                  {parseInt(doctor.workingHours?.to) < parseInt(doctor.workingHours?.from) && 
                    <span className="text-blue-600 ml-2">(PM)</span>
                  }
                </p>
                <p className="text-gray-600 text-sm">
                  Slot Duration: {doctor.slotDuration || 15} minutes
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
                      <span className="font-medium">{formatTimeDisplay(selectedTime)}</span>
                    </div>
                  )}
                  {doctor && (
                    <div className="flex justify-between">
                      <span className="text-blue-200">Duration</span>
                      <span className="font-medium">{doctor.slotDuration || 15} min</span>
                    </div>
                  )}
                  {doctor && (
                    <div className="flex justify-between">
                      <span className="text-blue-200">Fee</span>
                      <span className="font-medium">৳{doctor.fee || 0}</span>
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
              {/* 🔥 Form এর onKeyDown ইভেন্ট যোগ করুন */}
              <form 
                ref={formRef}
                onSubmit={handleSubmit}
                onKeyDown={handleKeyDown}
                id="appointment-form"
              >
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

                {/* Step 2: Time - 15 minutes slots */}
                {step===2 && (
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Select Time Slot ({doctor?.slotDuration || 15} minutes each)</h3>
                    
                    {/* Working hours info */}
                    {doctor && (
                      <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-700">
                          <strong>Available Time Slots:</strong> {formatTimeDisplay(`${doctor.workingHours?.from || "9"}:00`)} - {formatTimeDisplay(`${parseInt(doctor.workingHours?.to) < parseInt(doctor.workingHours?.from) ? parseInt(doctor.workingHours?.to) + 12 : doctor.workingHours?.to || "5"}:00`)}
                          <br />
                          <strong>Slot Duration:</strong> {doctor.slotDuration || 15} minutes • <strong>Total Slots:</strong> {availableSlots.length}
                        </p>
                      </div>
                    )}
                    
                    {/* Time slots - scrollable container for many slots */}
                    <div className="max-h-96 overflow-y-auto pr-2">
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {availableSlots.map(slot => (
                          <button 
                            type="button" 
                            key={slot} 
                            onClick={() => setSelectedTime(slot)}
                            className={`p-3 rounded-xl border-2 transition-all ${
                              selectedTime === slot
                                ? 'border-blue-500 bg-blue-50 shadow-md' 
                                : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                            }`}
                          >
                            <div className="text-center">
                              <Clock className="w-5 h-5 mx-auto mb-1 text-gray-700" />
                              <span className="font-medium text-gray-900 text-sm">
                                {formatTimeDisplay(slot)}
                              </span>
                              <p className="text-xs text-gray-500 mt-1">
                                {slot}
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    {availableSlots.length === 0 && (
                      <div className="text-center py-8">
                        <Clock className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-500">Please select a date to see available time slots</p>
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
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                // Enter প্রেস করলে phone ফিল্ডে focus করবে
                                document.querySelector('input[name="phone"]')?.focus();
                              }
                            }}
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
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                // Enter প্রেস করলে email ফিল্ডে focus করবে
                                document.querySelector('input[name="email"]')?.focus();
                              }
                            }}
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
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleNext(); // Enter প্রেস করলে Next step এ যাবে
                            }
                          }}
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
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && e.ctrlKey) {
                              // Ctrl+Enter প্রেস করলে Next step এ যাবে
                              e.preventDefault();
                              handleNext();
                            }
                          }}
                          placeholder="Any specific symptoms or notes for the doctor..."
                          className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-32"
                        />
                        <p className="text-xs text-gray-500 mt-1">Press Ctrl+Enter to go to next step</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: Payment */}
                {step===4 && (
                  <div>
                    <h3 className="text-xl font-semibold mb-6">Payment Method</h3>
                    <div className="space-y-4">
                      <select 
                        name="paymentMethod" 
                        value={formData.paymentMethod} 
                        onChange={handleInputChange}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleNext(); // Enter প্রেস করলে Next step এ যাবে
                          }
                        }}
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="CASH">Cash (Pay at clinic)</option>
                        <option value="CARD">Credit/Debit Card</option>
                        <option value="BKASH">bKash</option>
                        <option value="NAGAD">Nagad</option>
                        <option value="ROCKET">Rocket</option>
                      </select>
                      
                      {formData.paymentMethod !== "CASH" && (
                        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <p className="text-sm text-yellow-800">
                            After confirming your appointment, you'll be redirected to the payment gateway to complete the payment.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 5: Confirmation - শুধুমাত্র এখানে Submit করতে দিবে */}
                {step===5 && (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Check className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Confirm Appointment</h3>
                    
                    <div className="bg-gray-50 p-6 rounded-lg mb-8 text-left max-w-md mx-auto">
                      <h4 className="font-semibold mb-4 border-b pb-2">Appointment Summary:</h4>
                      <div className="space-y-2 text-sm">
                        <p><strong>Doctor:</strong> {doctor?.name}</p>
                        <p><strong>Date:</strong> {new Date(selectedDate).toLocaleDateString()}</p>
                        <p><strong>Time:</strong> {selectedTime} ({formatTimeDisplay(selectedTime)})</p>
                        <p><strong>Duration:</strong> {doctor?.slotDuration || 15} minutes</p>
                        <p><strong>Fee:</strong> ৳{doctor?.fee || 0}</p>
                        <p><strong>Payment:</strong> {formData.paymentMethod}</p>
                        <p><strong>Notes:</strong> {formData.notes || "None"}</p>
                      </div>
                    </div>
                    
                    <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                      <p className="text-blue-700 text-sm">
                        Please click the <strong>Confirm Appointment</strong> button below to book your appointment.
                        Pressing Enter will not submit the form.
                      </p>
                    </div>
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
                      type="button" // 🔥 type="button" করুন, type="submit" নয়
                      onClick={handleSubmit} // 🔥 সরাসরি onClick হ্যান্ডলার যোগ করুন
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