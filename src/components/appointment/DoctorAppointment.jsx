import { useEffect, useMemo, useState } from "react";
import api from "../../api/api"; 

const mockDoctors = [
  {
    id: "d1",
    name: "Dr. Ayesha Rahman",
    specialty: "Cardiologist",
    experience: 12,
    rating: 4.8,
    fee: 1200,
    avatar: "https://i.pravatar.cc/150?img=47",
    about: "Expert in adult cardiology, ECG interpretation and heart failure management.",
  },
  {
    id: "d2",
    name: "Dr. Kamrul Hasan",
    specialty: "Dermatologist",
    experience: 8,
    rating: 4.6,
    fee: 800,
    avatar: "https://i.pravatar.cc/150?img=12",
    about: "Skin specialist for acne, eczema and cosmetic dermatology.",
  },
  {
    id: "d3",
    name: "Dr. Noor Jahan",
    specialty: "Pediatrician",
    experience: 10,
    rating: 4.9,
    fee: 1000,
    avatar: "https://i.pravatar.cc/150?img=65",
    about: "Child health, immunization and growth monitoring specialist.",
  },
  // add more as needed
];

const DoctorAppointment = () => {
  const [doctors, setDoctors] = useState([]);
  const [query, setQuery] = useState("");
  const [specialty, setSpecialty] = useState("All");
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  // Booking form state
  const [booking, setBooking] = useState({
    patientName: "",
    contact: "",
    date: "",
    time: "",
    reason: "",
  });

  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState("");
  const [bookingError, setBookingError] = useState("");

  const [loadingDoctors, setLoadingDoctors] = useState(true);

  useEffect(() => {
   
    const load = async () => {
      setLoadingDoctors(true);
      try {
        await new Promise((r) => setTimeout(r, 600)); // simulate delay
        setDoctors(mockDoctors);
      } catch (err) {
        setDoctors(mockDoctors); // fallback
      } finally {
        setLoadingDoctors(false);
      }
    };
    load();
  }, []);

  const specialties = useMemo(() => {
    const setS = new Set(["All"]);
    doctors.forEach((d) => setS.add(d.specialty));
    return Array.from(setS);
  }, [doctors]);

  const filtered = useMemo(() => {
    return doctors.filter((d) => {
      const matchesQuery =
        query.trim() === "" ||
        d.name.toLowerCase().includes(query.toLowerCase()) ||
        d.specialty.toLowerCase().includes(query.toLowerCase());
      const matchesSpecialty = specialty === "All" || d.specialty === specialty;
      return matchesQuery && matchesSpecialty;
    });
  }, [doctors, query, specialty]);

  // handle select doctor
  const openBookingFor = (doctor) => {
    setSelectedDoctor(doctor);
    setBooking({
      patientName: "",
      contact: "",
      date: "",
      time: "",
      reason: "",
    });
    setBookingError("");
    setBookingSuccess("");
  };

  const handleBookingChange = (e) => {
    const { name, value } = e.target;
    setBooking((prev) => ({ ...prev, [name]: value }));
  };

  const validateBooking = () => {
    if (!selectedDoctor) return "Select a doctor first.";
    if (!booking.patientName.trim()) return "Patient name is required.";
    if (!booking.contact.trim()) return "Contact is required.";
    if (!booking.date) return "Date is required.";
    if (!booking.time) return "Time is required.";
    return null;
  };

  const submitBooking = async (e) => {
    e.preventDefault();
    const errMsg = validateBooking();
    if (errMsg) {
      setBookingError(errMsg);
      setTimeout(() => setBookingError(""), 4000);
      return;
    }

    setBookingLoading(true);
    setBookingError("");
    setBookingSuccess("");

    try {
      // Replace with actual API call:
      // const res = await api.post("/appointments", { doctorId: selectedDoctor.id, ...booking });
      await new Promise((r) => setTimeout(r, 800)); // simulate network
      setBookingSuccess("Appointment booked successfully!");
      // optionally: close panel or reset
      setTimeout(() => setBookingSuccess(""), 4000);
    } catch (err) {
      setBookingError("Failed to book appointment. Try again.");
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4 dark:text-white">Book an Appointment</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Search & List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-center">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search doctor or specialty..."
              className="flex-1 border px-3 py-2 rounded-md dark:bg-gray-700 dark:text-white outline-none"
            />
            <select
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              className="w-44 border px-3 py-2 rounded-md dark:bg-gray-700 dark:text-white outline-none"
            >
              {specialties.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <button
              onClick={() => {
                setQuery("");
                setSpecialty("All");
              }}
              className="px-3 py-2 bg-gray-200 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500"
            >
              Reset
            </button>
          </div>

          {/* Doctor list */}
          <div className="space-y-4">
            {loadingDoctors ? (
              // simple skeleton list
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="animate-pulse bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                  <div className="h-4 w-1/3 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-3 w-full bg-gray-300 dark:bg-gray-700 rounded mb-1"></div>
                </div>
              ))
            ) : filtered.length === 0 ? (
              <div className="p-4 bg-white dark:bg-gray-800 rounded text-gray-600">No doctors found.</div>
            ) : (
              filtered.map((doctor) => (
                <DoctorCard key={doctor.id} doctor={doctor} onBook={() => openBookingFor(doctor)} />
              ))
            )}
          </div>
        </div>

        {/* Right: Booking panel */}
        <aside className="lg:col-span-1 bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          {!selectedDoctor ? (
            <div className="text-center text-gray-600">
              <p className="mb-3">Choose a doctor to book an appointment</p>
              <p className="text-sm">Click <span className="font-semibold">Book</span> on any doctor card.</p>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-3 mb-3">
                <img src={selectedDoctor.avatar} alt={selectedDoctor.name} className="w-12 h-12 rounded-full" />
                <div>
                  <div className="font-semibold">{selectedDoctor.name}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{selectedDoctor.specialty}</div>
                </div>
              </div>

              <form onSubmit={submitBooking} className="space-y-3">
                <div>
                  <label className="text-sm block mb-1">Patient name</label>
                  <input
                    name="patientName"
                    value={booking.patientName}
                    onChange={handleBookingChange}
                    className="w-full border px-3 py-2 rounded-md dark:bg-gray-700 dark:text-white outline-none"
                    placeholder="Full name"
                  />
                </div>

                <div>
                  <label className="text-sm block mb-1">Contact</label>
                  <input
                    name="contact"
                    value={booking.contact}
                    onChange={handleBookingChange}
                    className="w-full border px-3 py-2 rounded-md dark:bg-gray-700 dark:text-white outline-none"
                    placeholder="Phone or email"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-sm block mb-1">Date</label>
                    <input
                      type="date"
                      name="date"
                      value={booking.date}
                      onChange={handleBookingChange}
                      className="w-full border px-3 py-2 rounded-md dark:bg-gray-700 dark:text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-sm block mb-1">Time</label>
                    <input
                      type="time"
                      name="time"
                      value={booking.time}
                      onChange={handleBookingChange}
                      className="w-full border px-3 py-2 rounded-md dark:bg-gray-700 dark:text-white outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm block mb-1">Reason (optional)</label>
                  <textarea
                    name="reason"
                    value={booking.reason}
                    onChange={handleBookingChange}
                    rows={3}
                    className="w-full border px-3 py-2 rounded-md dark:bg-gray-700 dark:text-white outline-none"
                    placeholder="Short note about symptoms..."
                  />
                </div>

                {bookingError && <div className="text-red-500 text-sm">{bookingError}</div>}
                {bookingSuccess && <div className="text-green-500 text-sm">{bookingSuccess}</div>}

                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={bookingLoading}
                    className={`flex-1 px-4 py-2 rounded-md text-white ${bookingLoading ? "bg-gray-400" : "bg-green-600"}`}
                  >
                    {bookingLoading ? "Booking..." : `Book — ৳${selectedDoctor.fee}`}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedDoctor(null)}
                    className="px-4 py-2 rounded-md border"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};

const DoctorCard = ({ doctor, onBook }) => {
  return (
    <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
      <div className="flex items-center gap-4">
        <img src={doctor.avatar} alt={doctor.name} className="w-16 h-16 rounded-full object-cover" />
        <div>
          <div className="font-semibold">{doctor.name}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">{doctor.specialty} • {doctor.experience} yrs</div>
          <div className="text-sm text-yellow-500">{'★'.repeat(Math.round(doctor.rating))} <span className="text-gray-400 text-xs ml-1">({doctor.rating})</span></div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Fee: ৳{doctor.fee}</div>
        </div>
      </div>
      <div className="flex flex-col items-end gap-2">
        <button
          onClick={onBook}
          className="px-3 py-2 bg-green-600 text-white rounded-md"
        >
          Book
        </button>
        <button
          className="text-sm text-gray-500"
          onClick={() => alert(doctor.about)}
        >
          View
        </button>
      </div>
    </div>
  );
};

export default DoctorAppointment;
