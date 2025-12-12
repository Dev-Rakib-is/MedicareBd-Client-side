import { useState } from "react";
import { Calendar, Video, Phone, X } from "lucide-react";

const BookingModal = ({ doctor, onClose, onConfirm }) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedType, setSelectedType] = useState("In-person");

  const timeSlots = [
    "09:00 AM", "10:00 AM", "11:00 AM", 
    "12:00 PM", "02:00 PM", "03:00 PM", 
    "04:00 PM", "05:00 PM"
  ];

  const consultationTypes = ["In-person", "Video", "Phone"];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime) {
      alert("Please select date and time");
      return;
    }
    
    const bookingDetails = {
      doctorId: doctor._id,
      doctorName: doctor.name,
      date: selectedDate,
      time: selectedTime,
      type: selectedType,
      fee: doctor.fee
    };
    
    console.log("Booking details:", bookingDetails);
    
    if (onConfirm) {
      onConfirm(bookingDetails);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 animate-slideUp">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Book Appointment</h3>
            <p className="text-gray-600 text-sm mt-1">Schedule your consultation</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Doctor Info */}
        <div className="flex items-center gap-4 mb-8 p-4 bg-blue-50 rounded-xl">
          <img
            src={doctor.photo_url || "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400"}
            alt={doctor.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-white shadow"
          />
          <div className="flex-1">
            <h4 className="font-bold text-lg text-gray-900">{doctor.name}</h4>
            <p className="text-blue-600 font-medium">{doctor.specialization}</p>
            <div className="flex items-center gap-4 mt-1">
              <span className="text-gray-600 text-sm">Fee: <strong>{doctor.fee}৳</strong></span>
              <span className="text-gray-600 text-sm">Exp: <strong>{doctor.experience} years</strong></span>
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
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
                  className={`p-3 border rounded-lg text-sm transition ${
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

          {/* Summary */}
          {selectedDate && selectedTime && (
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-800 mb-2">Appointment Summary</h4>
              <div className="space-y-1 text-sm text-green-700">
                <p>📅 Date: <strong>{selectedDate}</strong></p>
                <p>🕐 Time: <strong>{selectedTime}</strong></p>
                <p>👨‍⚕️ Doctor: <strong>Dr. {doctor.name}</strong></p>
                <p>💵 Fee: <strong>{doctor.fee}৳</strong></p>
              </div>
            </div>
          )}

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
              className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 font-medium transition-all flex items-center justify-center gap-2"
              disabled={!selectedDate || !selectedTime}
            >
              <Calendar className="h-5 w-5" />
              Confirm Booking
            </button>
          </div>
        </form>

        {/* Note */}
        <p className="text-center text-gray-500 text-sm mt-6">
          You'll receive a confirmation email/SMS shortly
        </p>
      </div>
    </div>
  );
};

export default BookingModal;