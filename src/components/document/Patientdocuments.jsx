import { useEffect, useState } from "react";
import api from "../../api/api";
import { X, Upload } from "lucide-react";

const DOCUMENT_TYPES = ["All", "Prescription", "Report", "Invoice", "Insurance"];
const SUPPORTED_FILE_TYPES = ["application/pdf", "image/jpeg", "image/png"];

const PatientDocuments = ({ userRole = "PATIENT", patientId = null }) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null); // preview
  const [uploading, setUploading] = useState(false);

  // Fetch documents
  const fetchDocuments = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/documents");
      setDocuments(res.data.documents || []);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to load documents");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDocuments(); }, []);

  // Upload document
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!SUPPORTED_FILE_TYPES.includes(file.type)) return alert("Unsupported file type!");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", file.name.split(".").pop() || "Report");
    if(userRole === "DOCTOR" && patientId) formData.append("patientId", patientId);

    try {
      setUploading(true);
      const res = await api.post("/documents/upload", formData, { headers: { "Content-Type":"multipart/form-data" } });
      setDocuments(prev => [res.data.document, ...prev]);
      alert("Document uploaded successfully!");
    } catch(err) {
      console.error(err);
      alert(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = null;
    }
  };

  // Delete document
  const handleDelete = async (id) => {
    if(!window.confirm("Are you sure you want to delete this document?")) return;
    try {
      await api.delete(`/documents/${id}`);
      setDocuments(prev => prev.filter(d => d._id !== id));
      alert("Deleted successfully");
    } catch(err) {
      console.error(err);
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  // Filter + search
  const filteredDocuments = documents
    .filter(doc => filter === "All" || doc.type === filter)
    .filter(doc => doc.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="mt-16 p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold">Documents</h1>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <select
            className="border px-3 py-2 rounded-md"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            {DOCUMENT_TYPES.map(d => <option key={d} value={d}>{d}</option>)}
          </select>

          <input
            type="text"
            placeholder="Search documents..."
            className="border px-3 py-2 rounded-md"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {["PATIENT","DOCTOR","ADMIN"].includes(userRole) && (
            <label className="px-3 py-2 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-500 flex items-center gap-2">
              {uploading ? "Uploading..." : <><Upload size={16} /> Upload</>}
              <input type="file" className="hidden" onChange={handleUpload} />
            </label>
          )}

          <button
            onClick={fetchDocuments}
            className="px-3 py-2 border rounded hover:bg-gray-100"
          >
            Refresh
          </button>
        </div>
      </header>

      {/* Loading / Error / Empty */}
      {loading ? (
        <div className="text-center py-20">Loading documents...</div>
      ) : error ? (
        <div className="text-center text-red-600">{error}</div>
      ) : filteredDocuments.length === 0 ? (
        <div className="text-center py-10 text-gray-600">No documents found.</div>
      ) : (
        <div className="border rounded-lg bg-white divide-y">
          {filteredDocuments.map(doc => (
            <div key={doc._id} className="flex justify-between items-center p-4">
              <div>
                <p className="font-semibold">{doc.name}</p>
                <p className="text-sm text-gray-500">{new Date(doc.date).toLocaleDateString()}</p>
                <span className={`text-sm py-1 px-2 rounded-full ${
                  doc.status === "Verified"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}>
                  {doc.status || "Pending"}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  className="text-blue-600 underline text-sm"
                  onClick={() => setSelected(doc)}
                >
                  View
                </button>

                <a
                  href={doc.url}
                  target="_blank"
                  className="text-sm underline text-gray-700"
                  rel="noreferrer"
                >
                  Download
                </a>

                {["PATIENT","DOCTOR","ADMIN"].includes(userRole) && (
                  <button
                    className="text-red-600 text-sm"
                    onClick={() => handleDelete(doc._id)}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Preview Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full p-6 relative">
            <button
              onClick={() => setSelected(null)}
              className="absolute top-4 right-4 text-gray-600"
            >
              <X />
            </button>

            <h2 className="text-xl font-semibold mb-4">{selected.name}</h2>

            {selected.url.endsWith(".pdf") ? (
              <iframe
                src={selected.url}
                className="w-full h-[500px]"
                title={selected.name}
              />
            ) : (
              <img src={selected.url} alt={selected.name} className="w-full max-h-[500px] object-contain" />
            )}

            <div className="mt-4 flex justify-end gap-3">
              <a
                href={selected.url}
                target="_blank"
                className="px-4 py-2 border rounded hover:bg-gray-100"
                rel="noreferrer"
              >
                Download
              </a>
              <button
                onClick={() => setSelected(null)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDocuments;
