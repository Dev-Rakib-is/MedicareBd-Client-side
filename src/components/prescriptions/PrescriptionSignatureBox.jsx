import { useState } from "react";
import api from "../../api/api";

const PrescriptionSignatureBox = ({
  prescriptionId,
  onSigned,
  existingSignature,
}) => {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(existingSignature || null);
  const [fileData, setFileData] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setPreview(reader.result);
      setFileData(reader.result);
    };

    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!fileData) {
      alert("Please select signature first");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/prescriptions/signature", {
        prescriptionId,
        signature: fileData,
      });

      onSigned?.(res.data.data);
    } catch (err) {
      alert(err.response?.data?.message || "Signature upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border rounded-xl p-6 bg-gray-50 shadow-sm">
      <h3 className="font-semibold text-gray-700 mb-4">
        Doctor Digital Signature
      </h3>

      <div className="flex flex-col items-center gap-4">
        {preview && (
          <div className="border p-3 rounded bg-white">
            <img
              src={preview}
              alt="signature"
              className="h-28 object-contain"
            />
          </div>
        )}

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="text-sm"
        />

        <button
          onClick={handleUpload}
          disabled={loading || !fileData}
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? "Uploading..." : "Save Signature"}
        </button>
      </div>
    </div>
  );
};

export default PrescriptionSignatureBox;
