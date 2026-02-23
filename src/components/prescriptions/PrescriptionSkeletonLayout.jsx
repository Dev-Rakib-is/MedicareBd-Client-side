import PrescriptionHeader from "./PrescriptionHeader";
import PrescriptionRXSection from "./PrescriptionRXSection";
import PrescriptionAdviceSection from "./PrescriptionAdviceSection";

const PrescriptionSkeletonLayout = ({ prescription }) => {
  if (!prescription) return null;

  return (
    <div className="bg-white p-8 border rounded-2xl shadow-sm relative">
      {/* ✅ Status Badge */}
      <div className="absolute top-4 right-4">
        <span
          className={`px-3 py-1 text-xs rounded-full ${
            prescription.isFinalized
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {prescription.isFinalized ? "Finalized" : "Draft"}
        </span>
      </div>

      {/* Header */}
      <PrescriptionHeader
        doctor={prescription?.doctorId}
        patient={prescription?.patientId}
      />

      {/* ================= LEFT + RIGHT STYLE ================= */}
      <div className="grid md:grid-cols-2 gap-8 mt-6">
        {/* ================= LEFT SIDE ================= */}
        <div className="border-r pr-6">
          {/* CC Section */}
          <div className="mb-6">
            <h3 className="font-bold text-red-600 mb-2">C / C</h3>
            <div className="bg-gray-50 p-3 rounded text-sm text-gray-600">
              {prescription?.layout?.cc || "No complaint added"}
            </div>
          </div>

          {/* OE Section */}
          <div className="mb-6">
            <h3 className="font-bold text-blue-600 mb-2">O / E</h3>
            <div className="bg-gray-50 p-3 rounded text-sm text-gray-600">
              {prescription?.layout?.oe || "No examination notes"}
            </div>
          </div>

          {/* Advice */}
          <PrescriptionAdviceSection
            notes={prescription?.layout?.advice || prescription?.notes}
          />
        </div>

        {/* ================= RIGHT SIDE ================= */}
        <div>
          <PrescriptionRXSection medications={prescription?.medications} />
        </div>
      </div>

      {/* ================= SIGNATURE ================= */}
      {prescription?.signature && (
        <div className="border-t mt-6 pt-4 text-right">
          <img
            src={prescription.signature}
            alt="signature"
            className="h-16 ml-auto"
          />

          <p className="text-xs text-gray-500">Doctor Signature</p>
        </div>
      )}

      {/* Footer */}
      <div className="border-t mt-6 pt-4 text-xs text-gray-500 text-center">
        • Take medicine after meal • Follow doctor follow-up schedule
      </div>
    </div>
  );
};

export default PrescriptionSkeletonLayout;
