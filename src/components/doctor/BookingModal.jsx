import { useState } from "react";
import { Calendar, Video, Phone, X, CreditCard, Wallet, Banknote, Check } from "lucide-react";

const BookingModal = ({ doctor, onClose, onConfirm }) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedType, setSelectedType] = useState("Video");
  const [selectedPayment, setSelectedPayment] = useState("card");
  const [step, setStep] = useState(1); // 1: Booking, 2: Payment, 3: Confirmation

  const timeSlots = [
    "09:00 AM", "10:00 AM", "11:00 AM", 
    "12:00 PM", "02:00 PM", "03:00 PM", 
    "04:00 PM", "05:00 PM"
  ];

  const consultationTypes = ["Video", "Phone"];
  
  const paymentMethods = [
    { id: "card", name: "Credit/Debit Card", icon: <CreditCard className="h-5 w-5" /> },
    { id: "mobile", name: "Mobile Banking", icon: <Wallet className="h-5 w-5" /> },
    { id: "cash", name: "Cash on Visit", icon: <Banknote className="h-5 w-5" /> },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime) {
      alert("Please select date and time");
      return;
    }
    
    if (step === 1) {
      setStep(2); // Go to payment step
      return;
    }
    
    const bookingDetails = {
      doctorId: doctor._id,
      doctorName: doctor.name,
      date: selectedDate,
      time: selectedTime,
      type: selectedType,
      fee: doctor.fee,
      paymentMethod: selectedPayment
    };
    
    console.log("Booking details:", bookingDetails);
    
    // Show confirmation
    setStep(3);
    
    // Auto confirm after 2 seconds
    setTimeout(() => {
      if (onConfirm) {
        onConfirm(bookingDetails);
      }
    }, 2000);
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
    } else if (step === 3) {
      setStep(2);
    }
  };

  // Format date
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 md:p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg md:rounded-2xl w-full max-w-2xl my-4 animate-slideUp">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-4 md:p-6 z-10">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900">
                {step === 1 ? "Book Appointment" : step === 2 ? "Payment" : "Booking Confirmed!"}
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                {step === 1 ? "Schedule your consultation" : 
                 step === 2 ? "Complete your payment" : 
                 "Your appointment is confirmed"}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          {/* Progress Steps */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'}`}>
                1
              </div>
              <div className="text-sm ml-2">Booking</div>
            </div>
            <div className="flex-1 h-1 mx-2 bg-gray-200">
              <div className={`h-full ${step >= 2 ? 'bg-blue-600' : ''}`} style={{width: step >= 2 ? '100%' : '0%'}}></div>
            </div>
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'}`}>
                2
              </div>
              <div className="text-sm ml-2">Payment</div>
            </div>
            <div className="flex-1 h-1 mx-2 bg-gray-200">
              <div className={`h-full ${step >= 3 ? 'bg-blue-600' : ''}`} style={{width: step >= 3 ? '100%' : '0%'}}></div>
            </div>
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'}`}>
                3
              </div>
              <div className="text-sm ml-2">Confirm</div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 md:p-6 overflow-y-auto max-h-[60vh] md:max-h-[70vh]">
          {/* Doctor Info - Always Visible */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6 p-4 bg-blue-50 rounded-xl">
            <img
              src={doctor.photo_url || "/default-doctor.png"}
              alt={doctor.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-white shadow flex-shrink-0"
            />
            <div className="flex-1">
              <h4 className="font-bold text-lg text-gray-900">{doctor.name}</h4>
              <p className="text-blue-600 font-medium">{doctor.specialization}</p>
              <div className="flex flex-wrap gap-3 md:gap-4 mt-1">
                <span className="text-gray-600 text-sm">Fee: <strong>{doctor.fee}৳</strong></span>
                <span className="text-gray-600 text-sm">Exp: <strong>{doctor.experience} years</strong></span>
                {step > 1 && selectedDate && (
                  <span className="text-gray-600 text-sm">
                    📅 {new Date(selectedDate).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Step 1: Booking Form */}
          {step === 1 && (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Horizontal Layout for Medium+ Devices */}
              <div className="md:grid md:grid-cols-2 md:gap-6">
                {/* Left Column - Date & Time */}
                <div className="space-y-6">
                  {/* Date Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="inline h-4 w-4 mr-2" />
                      Select Date
                    </label>
                    <input
                      type="date"
                      required
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>

                  {/* Time Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Time Slot
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {timeSlots.map((time) => (
                        <button
                          key={time}
                          type="button"
                          onClick={() => setSelectedTime(time)}
                          className={`p-2 md:p-3 border rounded-lg text-sm transition ${
                            selectedTime === time
                              ? "bg-blue-600 text-white border-blue-600"
                              : "border-gray-300 hover:bg-blue-50 hover:border-blue-500"
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column - Consultation Type & Summary */}
                <div className="space-y-6">
                  {/* Consultation Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Consultation Type
                    </label>
                    <div className="flex gap-2">
                      {consultationTypes.map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setSelectedType(type)}
                          className={`flex-1 p-3 border rounded-lg flex items-center justify-center gap-2 transition ${
                            selectedType === type
                              ? "bg-blue-100 border-blue-500 text-blue-700"
                              : "border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {type === "Video" && <Video className="h-4 w-4" />}
                          {type === "Phone" && <Phone className="h-4 w-4" />}
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Booking Summary */}
                  {selectedDate && selectedTime && (
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <h4 className="font-semibold text-green-800 mb-2">Appointment Summary</h4>
                      <div className="space-y-2 text-sm text-green-700">
                        <div className="flex justify-between">
                          <span>Doctor:</span>
                          <strong>Dr. {doctor.name}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span>Date:</span>
                          <strong>{formatDate(selectedDate)}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span>Time:</span>
                          <strong>{selectedTime}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span>Type:</span>
                          <strong>{selectedType} Consultation</strong>
                        </div>
                        <div className="flex justify-between border-t border-green-200 pt-2 mt-2">
                          <span>Total Fee:</span>
                          <strong className="text-lg">{doctor.fee}৳</strong>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition flex items-center justify-center gap-2"
                  disabled={!selectedDate || !selectedTime}
                >
                  Continue to Payment
                </button>
              </div>
            </form>
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Payment Methods */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Select Payment Method</h4>
                <div className="space-y-3">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setSelectedPayment(method.id)}
                      className={`w-full p-4 border rounded-xl flex items-center gap-4 transition ${
                        selectedPayment === method.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-300 hover:border-blue-300 hover:bg-blue-50/50"
                      }`}
                    >
                      <div className={`p-2 rounded-lg ${
                        selectedPayment === method.id ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600"
                      }`}>
                        {method.icon}
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-medium">{method.name}</div>
                        {method.id === "card" && <div className="text-sm text-gray-500">Pay with Visa/MasterCard</div>}
                        {method.id === "mobile" && <div className="text-sm text-gray-500">bKash, Nagad, Rocket</div>}
                        {method.id === "cash" && <div className="text-sm text-gray-500">Pay at clinic/hospital</div>}
                      </div>
                      {selectedPayment === method.id && (
                        <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
                          <Check className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment Summary */}
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <h4 className="font-semibold text-gray-800 mb-3">Payment Summary</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Consultation Fee</span>
                    <span>{doctor.fee}৳</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service Charge</span>
                    <span>50৳</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">VAT (5%)</span>
                    <span>{Math.round(doctor.fee * 0.05)}৳</span>
                  </div>
                  <div className="border-t border-gray-300 pt-2 mt-2">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total Amount</span>
                      <span className="text-blue-600">{doctor.fee + 50 + Math.round(doctor.fee * 0.05)}৳</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex-1 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 font-medium transition flex items-center justify-center gap-2"
                >
                  <CreditCard className="h-5 w-5" />
                  Pay Now
                </button>
              </div>

              {/* Security Note */}
              <div className="text-center text-xs text-gray-500 mt-4">
                <p>✅ Secure payment • 256-bit SSL encryption</p>
                <p>Your payment information is safe with us</p>
              </div>
            </form>
          )}

          {/* Step 3: Confirmation */}
          {step === 3 && (
            <div className="space-y-6">
              {/* Success Animation */}
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="h-10 w-10 text-green-600" />
                </div>
                <h4 className="text-2xl font-bold text-gray-900 mb-2">Appointment Confirmed!</h4>
                <p className="text-gray-600">Your booking has been successfully completed</p>
              </div>

              {/* Booking Details */}
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-3">Booking Details</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Reference No:</span>
                    <strong className="text-blue-600">APT{Date.now().toString().slice(-6)}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Doctor:</span>
                    <strong>Dr. {doctor.name}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date & Time:</span>
                    <strong>{formatDate(selectedDate)} at {selectedTime}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Consultation:</span>
                    <strong>{selectedType}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Method:</span>
                    <strong>
                      {paymentMethods.find(m => m.id === selectedPayment)?.name}
                    </strong>
                  </div>
                  <div className="flex justify-between border-t border-blue-200 pt-3 mt-3">
                    <span className="text-gray-600">Amount Paid:</span>
                    <strong className="text-lg text-green-600">{doctor.fee}৳</strong>
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                <h4 className="font-semibold text-yellow-800 mb-2">📋 What's Next?</h4>
                <ul className="space-y-2 text-sm text-yellow-700">
                  <li className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-yellow-100 text-yellow-800 flex items-center justify-center text-xs">1</div>
                    <span>You'll receive confirmation SMS & Email</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-yellow-100 text-yellow-800 flex items-center justify-center text-xs">2</div>
                    <span>Join consultation 5 minutes before scheduled time</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-yellow-100 text-yellow-800 flex items-center justify-center text-xs">3</div>
                    <span>Have your medical reports ready (if any)</span>
                  </li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => window.print()}
                  className="flex-1 py-3 border border-blue-300 rounded-lg text-blue-600 hover:bg-blue-50 font-medium transition"
                >
                  Print Receipt
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Note */}
        {step !== 3 && (
          <div className="border-t p-4 bg-gray-50">
            <p className="text-center text-xs text-gray-500">
              Need help? Call us at <strong className="text-blue-600">16453</strong> or email support@medicare.com
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingModal;