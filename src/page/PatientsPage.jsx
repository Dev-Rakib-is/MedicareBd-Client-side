
import React, { useEffect, useMemo, useState } from "react";
import api from "../api/api"; 
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Search,
  UserPlus,
  Trash2,
  Video,
  MessageCircle,
  XCircle,
  CheckCircle,
  Filter,
} from "lucide-react";
import PatientDetailsModal from "../components/patients/PatientDetailsModal";
import AddPatientModal from "../components/patients/PatientDetailsModal";

const PAGE_SIZE = 8;

export default function PatientsPage() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all"); 
  const [tab, setTab] = useState("recent"); 
  const [page, setPage] = useState(1);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    fetchPatients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, roleFilter, tab, page, refreshKey]);

  async function fetchPatients() {
    setLoading(true);
    setError("");
    try {
      const q = new URLSearchParams();
      q.set("search", search || "");
      q.set("role", roleFilter);
      q.set("tab", tab);
      q.set("page", page);
      q.set("limit", PAGE_SIZE);
      const res = await api.get(`/patient/my?${q.toString()}`);
      // expect { patients: [], total, page, limit }
      setPatients(res.data.patients || []);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to load patients");
    } finally {
      setLoading(false);
    }
  }

  const totalPages = useMemo(() => {
    // if backend returns total, use it; fallback estimate
    return Math.max(1, Math.ceil((patients?.total || patients.length) / PAGE_SIZE));
  }, [patients]);

  // optimistic remove
  async function handleRemovePatient(patientId) {
    if (!confirm("Are you sure you want to remove this patient?")) return;
    const prev = patients;
    setPatients((p) => p.filter((x) => x._id !== patientId));
    try {
      await api.delete(`/patient/${patientId}`);
      toast.success("Patient removed");
    } catch (err) {
      setPatients(prev);
      toast.error("Failed to remove patient");
    }
  }

  function handleOpenDetails(patient) {
    setSelectedPatient(patient);
  }

  async function handleStartConsultation(patientId, mode = "video") {

    try {
      // try REST call (optional) to create consultation or use sockets
      const res = await api.post("/consultations/start", {
        patientId,
        mode,
      });
      // open new page / show modal / navigate
      const consultation = res.data.consultation;
      // redirect client to consultation page where live component connects sockets
      window.location.href = `/consultation/${consultation._id}`; // adjust route
    } catch (err) {
      console.error(err);
      toast.error("Could not start consultation. Check server.");
    }
  }

  return (
    <div className="p-6 max-w-6xl mx-auto mt-16">
      <ToastContainer />
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Patients</h1>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
              placeholder="Search patients..."
              className="pl-9 pr-3 py-2 border rounded w-64"
            />
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-green-600 text-white px-3 py-2 rounded"
          >
            <UserPlus size={16} /> Add Patient
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        {["recent", "previous", "all"].map((t) => (
          <button
            key={t}
            onClick={() => {
              setTab(t);
              setPage(1);
            }}
            className={`px-3 py-1 rounded ${tab === t ? "bg-blue-600 text-white" : "bg-gray-100"}`}
          >
            {t === "recent" ? "Recent" : t === "previous" ? "Previous" : "All"}
          </button>
        ))}

        <div className="ml-4 flex items-center gap-2">
          <Filter size={14} />
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setPage(1);
            }}
            className="border py-1 px-2 rounded"
          >
            <option value="all">All roles</option>
            <option value="patient">Patient</option>
            {/* add others if needed */}
          </select>
        </div>
      </div>

      {/* list */}
      <div className="bg-white border rounded">
        <div className="grid grid-cols-12 gap-3 px-4 py-3 font-semibold border-b">
          <div className="col-span-5">Name</div>
          <div className="col-span-3">Last Visit</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        {loading ? (
          <div className="p-6 text-center">Loading...</div>
        ) : error ? (
          <div className="p-6 text-center text-red-600">{error}</div>
        ) : patients.length === 0 ? (
          <div className="p-6 text-center text-gray-500">No patients found.</div>
        ) : (
          <>
            {patients.map((p) => (
              <div key={p._id} className="grid grid-cols-12 gap-3 px-4 py-3 items-center border-b hover:bg-gray-50">
                <div className="col-span-5 flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-sm">
                    {p.name?.[0] || "?"}
                  </div>
                  <div>
                    <div className="font-medium">{p.name || "N/A"}</div>
                    <div className="text-sm text-gray-500">{p.age ? `${p.age} yrs` : ""} {p.city ? `• ${p.city}` : ""}</div>
                  </div>
                </div>
                <div className="col-span-3 text-sm text-gray-600">
                  {p.lastVisit ? new Date(p.lastVisit).toLocaleDateString() : "—"}
                </div>
                <div className="col-span-2">
                  {p.online ? (
                    <span className="inline-flex items-center gap-1 text-green-600"><CheckCircle size={14}/> Online</span>
                  ) : (
                    <span className="text-gray-500">Offline</span>
                  )}
                </div>

                <div className="col-span-2 flex justify-end gap-2">
                  <button
                    title="Open details"
                    onClick={() => handleOpenDetails(p)}
                    className="px-2 py-1 border rounded"
                  >
                    View
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      title="Chat"
                      onClick={() => handleStartConsultation(p._id, "chat")}
                      className="px-2 py-1 rounded border hover:bg-gray-50"
                    >
                      <MessageCircle size={16} />
                    </button>

                    <button
                      title="Start video"
                      onClick={() => handleStartConsultation(p._id, "video")}
                      className="px-2 py-1 rounded border bg-blue-600 text-white"
                    >
                      <Video size={16} />
                    </button>

                    <button
                      title="Remove"
                      onClick={() => handleRemovePatient(p._id)}
                      className="px-2 py-1 rounded border text-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* pagination controls */}
      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-gray-600">Page {page}</div>
        <div className="flex gap-2">
          <button
            onClick={() => setPage((s) => Math.max(1, s - 1))}
            className="px-3 py-1 border rounded disabled:opacity-50"
            disabled={page <= 1}
          >
            Prev
          </button>
          <button
            onClick={() => setPage((s) => s + 1)}
            className="px-3 py-1 border rounded"
          >
            Next
          </button>
        </div>
      </div>

      {/* modals */}
      {selectedPatient && (
        <PatientDetailsModal
          patientId={selectedPatient._id}
          onClose={() => setSelectedPatient(null)}
          onPatientUpdated={() => setRefreshKey((k) => k + 1)}
        />
      )}

      {showAddModal && (
        <AddPatientModal
          onClose={() => setShowAddModal(false)}
          onCreated={(newPatient) => {
            setShowAddModal(false);
            toast.success("Patient added");
            setRefreshKey((k) => k + 1);
          }}
        />
      )}
    </div>
  );
}
