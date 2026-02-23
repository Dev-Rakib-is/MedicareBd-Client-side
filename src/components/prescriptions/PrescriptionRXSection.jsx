const PrescriptionRXSection = ({ medications }) => {
  return (
    <div className="mb-6">
      <h3 className="text-xl font-bold text-red-600 mb-3">RX</h3>

      {medications?.map((m, i) => (
        <div
          key={i}
          className="flex justify-between border-b py-2 text-gray-800"
        >
          <span className="font-medium w-1/3">{m.name}</span>
          <span className="w-1/3">Dose: {m.dose}</span>
          <span className="w-1/3">Freq: {m.frequency}</span>
        </div>
      ))}
    </div>
  );
};

export default PrescriptionRXSection;
