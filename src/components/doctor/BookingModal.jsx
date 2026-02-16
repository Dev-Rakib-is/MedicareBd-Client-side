import { useState, useEffect } from "react";
import {
  Calendar,
  Video,
  Phone,
  X,
  CreditCard,
  Wallet,
  Banknote,
  Check,
} from "lucide-react";
import api from "../../api/api";

const BookingModal = ({ doctorId, onClose, onConfirm }) => {
  const [doctor, setDoctor] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedType, setSelectedType] = useState("Video");
  const [selectedPayment, setSelectedPayment] = useState("card");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);

  const consultationTypes = ["Video", "Phone"];
  const paymentMethods = [
    {
      id: "card",
      name: "Credit/Debit Card",
      icon: <CreditCard className="h-5 w-5" />,
    },
    {
      id: "mobile",
      name: "Mobile Banking",
      icon: <Wallet className="h-5 w-5" />,
    },
    {
      id: "cash",
      name: "Cash on Visit",
      icon: <Banknote className="h-5 w-5" />,
    },
  ];

  // Generate time slots based on working hours
  const generateSlots = (workingHours, slotDuration) => {
    const slots = [];
    if (!workingHours || !slotDuration) return slots;

    let [startH, startM] = workingHours.from.split(":").map(Number);
    const [endH, endM] = workingHours.to.split(":").map(Number);

    while (startH < endH || (startH === endH && startM < endM)) {
      slots.push(
        `${String(startH).padStart(2, "0")}:${String(startM).padStart(2, "0")}`,
      );
      startM += slotDuration;
      if (startM >= 60) {
        startH += Math.floor(startM / 60);
        startM = startM % 60;
      }
    }

    return slots;
  };

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await api.get(`/doctors/${doctorId}`);
        const doc = res.data?.doctor || {};
        setDoctor(doc);

        const slots = generateSlots(doc.workingHours, doc.slotDuration || 15);
        setAvailableSlots(slots);
      } catch (err) {
        console.error("Error fetching doctor data:", err);
        setDoctor({});
        setAvailableSlots([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctor();
  }, [doctorId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime) {
      alert("Please select date and time");
      return;
    }

    if (step === 1) {
      setStep(2);
      return;
    }

    const bookingDetails = {
      doctorId: doctor?._id || "",
      doctorName: doctor?.name || "N/A",
      date: selectedDate,
      time: selectedTime,
      type: selectedType,
      fee: doctor?.fee || 0,
      paymentMethod: selectedPayment,
    };

    console.log("Booking details:", bookingDetails);
    setStep(3);

    setTimeout(() => {
      if (onConfirm) onConfirm(bookingDetails);
    }, 2000);
  };

  const handleBack = () => {
    if (step === 2) setStep(1);
    else if (step === 3) setStep(2);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow text-center">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 md:p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg md:rounded-2xl w-full max-w-2xl my-4 animate-slideUp">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-4 md:p-6 z-10 border-black/40">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900">
                {step === 1
                  ? "Book Appointment"
                  : step === 2
                    ? "Payment"
                    : "Booking Confirmed!"}
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                {step === 1
                  ? "Schedule your consultation"
                  : step === 2
                    ? "Complete your payment"
                    : "Your appointment is confirmed"}
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
            {[1, 2, 3].map((num) => (
              <div key={num} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step >= num
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-400"
                  }`}
                >
                  {num}
                </div>
                <div className="text-sm ml-2">
                  {num === 1 ? "Booking" : num === 2 ? "Payment" : "Confirm"}
                </div>
                {num < 3 && (
                  <div className="flex-1 h-1 mx-2 bg-gray-200">
                    <div
                      className={`h-full ${step > num ? "bg-blue-600" : ""}`}
                      style={{ width: step > num ? "100%" : "0%" }}
                    ></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 md:p-6 overflow-y-auto max-h-[60vh] md:max-h-[70vh]">
          {/* Doctor Info */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6 p-4 bg-blue-50 rounded-xl">
            <img
              src={doctor?.photo_url || "/default-doctor.png"}
              alt={doctor?.name || "Doctor"}
              className="w-16 h-16 rounded-full object-cover border-2 border-white shadow flex-shrink-0"
            />
            <div className="flex-1">
              <h4 className="font-bold text-lg text-gray-900">
                {doctor?.name || "N/A"}
              </h4>
              <p className="text-blue-600 font-medium">
                {doctor?.specialization?.name || "N/A"}
              </p>
              <div className="flex flex-wrap gap-3 md:gap-4 mt-1">
                <span className="text-gray-600 text-sm">
                  Fee: <strong>{doctor?.fee || 0}৳</strong>
                </span>
                <span className="text-gray-600 text-sm">
                  Exp: <strong>{doctor?.experience || 0} years</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Step 1: Booking Form */}
          {step === 1 && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="md:grid md:grid-cols-2 md:gap-6">
                <div className="space-y-6">
                  {/* Date */}
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
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>

                  {/* Time */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Time Slot
                    </label>
                    {availableSlots.length > 0 ? (
                      <div className="grid grid-cols-3 gap-2">
                        {availableSlots.map((slot) => (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => setSelectedTime(slot)}
                            className={`p-2 md:p-3 border rounded-lg text-sm transition ${
                              selectedTime === slot
                                ? "bg-blue-600 text-white border-blue-600"
                                : "border-gray-300 hover:bg-blue-50 hover:border-blue-500"
                            }`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">No slots available</p>
                    )}
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
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
                </div>
              </div>

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
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  Select Payment Method
                </h4>
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
                      <div
                        className={`p-2 rounded-lg ${
                          selectedPayment === method.id
                            ? "bg-blue-100 text-blue-600"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {method.icon}
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-medium">{method.name}</div>
                        {method.id === "card" && (
                          <div className="text-sm text-gray-500">
                            Pay with Visa/MasterCard
                          </div>
                        )}
                        {method.id === "mobile" && (
                          <div className="text-sm text-gray-500">
                            bKash, Nagad, Rocket
                          </div>
                        )}
                        {method.id === "cash" && (
                          <div className="text-sm text-gray-500">
                            Pay at clinic/hospital
                          </div>
                        )}
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
                  <CreditCard className="h-5 w-5" /> Pay Now
                </button>
              </div>
            </form>
          )}

          {/* Step 3: Confirmation */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="h-10 w-10 text-green-600" />
                </div>
                <h4 className="text-2xl font-bold text-gray-900 mb-2">
                  Appointment Confirmed!
                </h4>
                <p className="text-gray-600">
                  Your booking has been successfully completed
                </p>
              </div>

              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-3">
                  Booking Details
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Reference No:</span>
                    <strong className="text-blue-600">
                      APT{Date.now().toString().slice(-6)}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Doctor:</span>
                    <strong>Dr. {doctor?.name || "N/A"}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date & Time:</span>
                    <strong>
                      {formatDate(selectedDate)} at {selectedTime}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Consultation:</span>
                    <strong>{selectedType}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Method:</span>
                    <strong>
                      {
                        paymentMethods.find((m) => m.id === selectedPayment)
                          ?.name
                      }
                    </strong>
                  </div>
                  <div className="flex justify-between border-t border-blue-200 pt-3 mt-3">
                    <span className="text-gray-600">Amount Paid:</span>
                    <strong className="text-lg text-green-600">
                      {doctor?.fee || 0}৳
                    </strong>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                <h4 className="font-semibold text-yellow-800 mb-2">
                  📋 What's Next?
                </h4>
                <ul className="space-y-2 text-sm text-yellow-700">
                  <li className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-yellow-100 text-yellow-800 flex items-center justify-center text-xs">
                      1
                    </div>
                    You'll receive confirmation SMS & Email
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-yellow-100 text-yellow-800 flex items-center justify-center text-xs">
                      2
                    </div>
                    Join consultation at scheduled time
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-yellow-100 text-yellow-800 flex items-center justify-center text-xs">
                      3
                    </div>
                    Follow-up instructions will be provided
                  </li>
                </ul>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
