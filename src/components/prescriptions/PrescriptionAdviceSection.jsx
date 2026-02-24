const PrescriptionAdviceSection = ({ notes }) => {
  if (!notes || !notes.trim()) return null;

  return (
    <div className="mt-6 border-t border-gray-200 pt-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">
        Doctor's Advice
      </h3>

      <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg text-sm text-gray-700 whitespace-pre-line">
        {notes}
      </div>
    </div>
  );
};

export default PrescriptionAdviceSection;
