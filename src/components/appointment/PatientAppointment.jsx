import { useEffect, useState } from "react";
import api from "../../api/api";
import { useAuth } from "../../contex/AuthContex";

const DoctorAppointment = () => {
  const { user } = useAuth();

  const [doctors, setDoctors] = useState([]);
  const [query, setQuery] = useState("");

  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [loadingDoctors, setLoadingDoctors] = useState(true);

  // Booking form
  const [booking, setBooking] = useState({
    patientName: "",
    contact: "",
    date: "",
    time: "",
    reason: "",
  });

  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState("");

  // Load doctors
  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/doctors");
        setDoctors(res.data.doctors || []);
      } catch (err) {
        console.log(err);
      } finally {
        setLoadingDoctors(false);
      }
    };
    load();
  }, []);

  // Open modal + set doctor
  const openBooking = (doctor) => {
    setSelectedDoctor(doctor);
    setBooking({
      patientName: user?.name || "",
      contact: user?.contact || "",
      date: "",
      time: "",
      reason: "",
    });
    setShowModal(true);
  };

  const handleChange = (e) => {
    setBooking({ ...booking, [e.target.name]: e.target.value });
  };

  const submitBooking = async (e) => {
    e.preventDefault();

    if (!booking.date || !booking.time) {
      setBookingError("Date & Time required.");
      return;
    }

    setBookingLoading(true);
    try {
      await api.post("/appointments", {
        doctorId: selectedDoctor._id,
        patientId: user._id,
        ...booking,
      });

      setBookingSuccess("Appointment booked!");
      setTimeout(() => {
        setShowModal(false);
        setBookingSuccess("");
      }, 1500);
    } catch (err) {
      setBookingError("Booking failed!");
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="p-6 mt-16">

      <h1 className="text-2xl font-semibold mb-4 dark:text-white">Book Doctor Appointment</h1>

      <input
        className="border px-3 py-2 rounded-md w-full dark:bg-gray-700 dark:text-white mb-5"
        placeholder="Search doctor..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {/* Doctor List */}
      <div className="space-y-4">
        {loadingDoctors ? (
          <p className="text-gray-500">Loading doctors...</p>
        ) : (
          doctors
            .filter((d) => d.name.toLowerCase().includes(query.toLowerCase()))
            .map((doctor) => (
              <DoctorCard key={doctor._id} doctor={doctor} openBooking={openBooking} />
            ))
        )}
      </div>

      {/* Booking Modal */}
      {showModal && selectedDoctor && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-3 dark:text-white">
              Book Appointment with {selectedDoctor.name}
            </h2>

            <form className="space-y-3" onSubmit={submitBooking}>
              <input
                name="patientName"
                value={booking.patientName}
                onChange={handleChange}
                placeholder="Patient name"
                className="w-full border px-3 py-2 rounded dark:bg-gray-700 dark:text-white"
              />

              <input
                name="contact"
                value={booking.contact}
                onChange={handleChange}
                placeholder="Contact"
                className="w-full border px-3 py-2 rounded dark:bg-gray-700 dark:text-white"
              />

              <input
                type="date"
                name="date"
                value={booking.date}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded dark:bg-gray-700 dark:text-white"
              />

              <input
                type="time"
                name="time"
                value={booking.time}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded dark:bg-gray-700 dark:text-white"
              />

              <textarea
                name="reason"
                value={booking.reason}
                onChange={handleChange}
                placeholder="Reason (optional)"
                className="w-full border px-3 py-2 rounded dark:bg-gray-700 dark:text-white"
                rows={3}
              />

              {bookingError && <p className="text-red-500 text-sm">{bookingError}</p>}
              {bookingSuccess && <p className="text-green-500 text-sm">{bookingSuccess}</p>}

              <div className="flex gap-2 mt-4">
                <button
                  type="submit"
                  disabled={bookingLoading}
                  className="flex-1 bg-green-600 text-white py-2 rounded"
                >
                  {bookingLoading ? "Booking..." : `Book — ৳${selectedDoctor.fee}`}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded"
                >
                  Close
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
// Doctor Card Component
const DoctorCard = ({ doctor, openBooking }) => {
  return (
    <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-lg shadow">

      <div className="flex items-center gap-4">
        {/* Image safe fix */}
        {doctor.photo_url ? (
          <img
            src={doctor.photo_url}
            alt={doctor.name}
            className="w-16 h-16 rounded-full object-cover"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-gray-300"></div>
        )}

        <div>
          <div className="font-semibold">{doctor.name}</div>
          <div className="text-sm text-gray-500">{doctor.specialization}</div>
          <div className="text-sm">Fee: ৳{doctor.fee}</div>
        </div>
      </div>

      <button
        onClick={() => openBooking(doctor)}
        className="px-3 py-2 bg-green-600 text-white rounded-md"
      >
        Book
      </button>
    </div>
  );
};

export default DoctorAppointment;
