import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";

const PrescriptionPrintView = ({ prescription }) => {
  const printRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  if (!prescription) return null;

  return (
    <div className="mt-4">
      <button
        onClick={handlePrint}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
      >
        Print Prescription
      </button>

      <div ref={printRef} className="bg-white p-8 border rounded-lg">
        {/* Doctor Info */}
        <div className="border-b pb-4 mb-4">
          <h2 className="text-2xl font-bold text-green-700">
            Dr. {prescription?.doctorId?.name}
          </h2>
          <p className="text-sm text-gray-500">
            {prescription?.doctorId?.department}
          </p>
        </div>

        {/* Patient Info */}
        <div className="mb-4">
          <p className="text-gray-700">
            Patient: {prescription?.patientId?.name}
          </p>
          <p className="text-gray-500 text-sm">
            Date: {new Date(prescription.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* RX */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-red-600 mb-2">RX</h3>

          {prescription?.medications?.map((m, i) => (
            <div key={i} className="flex justify-between border-b py-2">
              <span className="font-medium">{m.name}</span>
              <span>{m.dose}</span>
              <span>{m.frequency}</span>
            </div>
          ))}
        </div>

        {/* Notes */}
        {prescription?.notes && (
          <div className="mt-4 border-t pt-4">
            <h3 className="font-semibold mb-2">Doctor Notes</h3>
            <p className="bg-gray-50 p-3 rounded">{prescription.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrescriptionPrintView;
