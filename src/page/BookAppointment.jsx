import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, Clock, User, Phone, Mail, MapPin, ChevronRight, Check, CreditCard } from 'lucide-react';
import api from '../api/api';

const BookAppointment = ({ user, doctorId }) => {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    notes: '',
    paymentMethod: 'CASH',
  });
  const [loading, setLoading] = useState(false);

  const services = [
    { id: 1, name: 'Consultation', duration: '30 min', price: 99 },
    { id: 2, name: 'Full Treatment', duration: '60 min', price: 199 },
    { id: 3, name: 'Premium Package', duration: '90 min', price: 299 },
    { id: 4, name: 'Follow-up', duration: '20 min', price: 79 }
  ];

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

  // Fetch available slots whenever date changes
  useEffect(() => {
    const fetchSlots = async () => {
      if (!selectedDate) return;
      try {
        const token = localStorage.getItem('token');
        const res = await api.get(`/doctors/${doctorId}/available-slots?date=${selectedDate}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAvailableSlots(res.data.slots); 
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

  const handleServiceSelect = (service) => {
    setSelectedService(service);
  };

  const handleNext = () => { if(step < 5) setStep(step + 1); };
  const handleBack = () => { if(step > 1) setStep(step - 1); };

  const isStepValid = () => {
    switch(step) {
      case 1: return selectedService;
      case 2: return selectedDate;
      case 3: return selectedTime;
      case 4: return formData.name && formData.email && formData.phone;
      case 5: return formData.paymentMethod;
      default: return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const serviceObj = services.find(s => s.name === selectedService);
      const payload = {
        doctorId,
        date: selectedDate,
        timeSlot: selectedTime,
        reason: serviceObj.name,
        notes: formData.notes,
        payment: {
          amount: serviceObj.price,
          status: formData.paymentMethod === 'CASH' ? 'UNPAID' : 'PAID',
          method: formData.paymentMethod
        }
      };
      const token = localStorage.getItem('token');
      const res = await axios.post('/api/appointments/', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('Appointment booked successfully!');
      setStep(1);
      setSelectedDate('');
      setSelectedTime('');
      setSelectedService('');
      setFormData({ name:'', email:'', phone:'', notes:'', paymentMethod:'CASH' });
      setAvailableSlots([]);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to book appointment');
    } finally { setLoading(false); }
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4">
      <div className="max-w-6xl mx-auto mt-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Book Your Appointment</h1>
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
                    <span className="text-sm">{['Service','Date','Time','Details','Payment'][stepNum-1]}</span>
                  </div>
                ))}
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8">
                <h3 className="font-semibold text-lg mb-4">Appointment Summary</h3>
                <div className="space-y-3">
                  {selectedService && <div className="flex justify-between"><span className="text-blue-200">Service</span><span className="font-medium">{selectedService}</span></div>}
                  {selectedDate && <div className="flex justify-between"><span className="text-blue-200">Date</span><span className="font-medium">{new Date(selectedDate).toLocaleDateString()}</span></div>}
                  {selectedTime && <div className="flex justify-between"><span className="text-blue-200">Time</span><span className="font-medium">{selectedTime}</span></div>}
                  {formData.paymentMethod && <div className="flex justify-between"><span className="text-blue-200">Payment</span><span className="font-medium">{formData.paymentMethod}</span></div>}
                </div>
              </div>
            </div>

            {/* Right Panel */}
            <div className="md:w-2/3 p-8">
              <form onSubmit={handleSubmit}>
                {/* Step 1: Service */}
                {step===1 && (
                  <div className="grid md:grid-cols-2 gap-4">
                    {services.map(s => (
                      <button key={s.id} type="button" onClick={()=>handleServiceSelect(s.name)} className={`p-6 rounded-xl border-2 ${selectedService===s.name?'border-blue-500 bg-blue-50 shadow-lg':'border-gray-200 hover:border-blue-300 hover:shadow-md'}`}>
                        <div className="flex justify-between items-start mb-4">
                          <div><h3 className="font-semibold text-lg text-gray-900">{s.name}</h3><p className="text-gray-600 text-sm">{s.duration}</p></div>
                          <span className="text-2xl font-bold text-blue-600">${s.price}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Step 2: Date */}
                {step===2 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {dates.map(d=>(
                      <button type="button" key={d.full} onClick={()=>setSelectedDate(d.full)} className={`p-4 rounded-xl border-2 ${selectedDate===d.full?'border-blue-500 bg-blue-50 shadow-lg':'border-gray-200 hover:border-blue-300'}`}>
                        <div className="text-center"><p className="text-gray-600 text-sm">{d.day}</p><p className="text-2xl font-bold text-gray-900 my-2">{d.date}</p><p className="text-gray-700">{d.month}</p></div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Step 3: Time */}
                {step===3 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {availableSlots.length ? availableSlots.map(t=>(
                      <button type="button" key={t} onClick={()=>setSelectedTime(t)} className={`p-4 rounded-xl border-2 ${selectedTime===t?'border-blue-500 bg-blue-50 shadow-lg':'border-gray-200 hover:border-blue-300'}`}>
                        <div className="text-center"><Clock className="w-6 h-6 mx-auto mb-2 text-gray-700" /><span className="font-medium text-gray-900">{t}</span></div>
                      </button>
                    )) : <p className="text-gray-500">No available slots for selected date</p>}
                  </div>
                )}

                {/* Step 4: Details */}
                {step===4 && (
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Full Name*" className="w-full px-4 py-3 border rounded-lg"/>
                      <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Phone*" className="w-full px-4 py-3 border rounded-lg"/>
                    </div>
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Email*" className="w-full px-4 py-3 border rounded-lg"/>
                    <textarea name="notes" value={formData.notes} onChange={handleInputChange} placeholder="Notes (optional)" className="w-full px-4 py-3 border rounded-lg"/>
                  </div>
                )}

                {/* Step 5: Payment */}
                {step===5 && (
                  <div className="space-y-4">
                    <label className="font-medium text-gray-700 flex items-center gap-2">
                      <CreditCard className="w-5 h-5"/> Select Payment Method
                    </label>
                    <select name="paymentMethod" value={formData.paymentMethod} onChange={handleInputChange} className="w-full px-4 py-3 border rounded-lg">
                      <option value="CASH">Cash</option>
                      <option value="CARD">Card</option>
                      <option value="BKASH">Bkash</option>
                      <option value="NAGAD">Nagad</option>
                      <option value="ROCKET">Rocket</option>
                    </select>
                  </div>
                )}

                {/* Navigation */}
                <div className="flex justify-between mt-12 pt-8 border-t border-gray-200">
                  <button type="button" onClick={handleBack} disabled={step===1} className={`px-8 py-3 rounded-lg ${step===1?'text-gray-400 cursor-not-allowed':'hover:bg-gray-100'}`}>Back</button>
                  
                  {step<5?(
                    <button type="button" onClick={handleNext} disabled={!isStepValid()} className={`px-8 py-3 rounded-lg ${isStepValid()?'bg-blue-600 text-white':'bg-gray-200 text-gray-500 cursor-not-allowed'}`}>Continue</button>
                  ):(
                    <button type="submit" disabled={loading} className="px-8 py-3 bg-green-600 text-white rounded-lg">{loading?'Booking...':'Confirm & Pay'}</button>
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
