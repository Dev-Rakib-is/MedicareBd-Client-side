const PrescriptionHeader = ({ doctor, patient }) => {
  return (
    <div className="border-b pb-4 mb-4">
      <h2 className="text-2xl font-bold text-green-700">Dr. {doctor?.name}</h2>

      <p className="text-sm text-gray-600">{doctor?.department}</p>

      <div className="mt-3 text-sm text-gray-700">
        <p>
          Patient: <span className="font-semibold">{patient?.name}</span>
        </p>

        <p className="text-gray-500">{patient?.email}</p>
      </div>
    </div>
  );
};

export default PrescriptionHeader;
