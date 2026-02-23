const PrescriptionAdviceSection = ({ notes }) => {
  if (!notes) return null;

  return (
    <div className="mt-4 border-t pt-4">
      <h3 className="font-semibold mb-2">Doctor Advice</h3>

      <p className="bg-blue-50 p-3 rounded text-sm text-gray-600">{notes}</p>
    </div>
  );
};

export default PrescriptionAdviceSection;
