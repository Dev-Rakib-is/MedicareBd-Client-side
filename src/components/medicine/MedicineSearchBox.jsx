import { useEffect, useState } from "react";
import api from "../../api/api";

const MedicineSearchBox = ({ onSelect }) => {
  const [keyword, setKeyword] = useState("");
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(false);

  /* Debounce Search */
  useEffect(() => {
    const timer = setTimeout(() => {
      if (keyword.length < 2) {
        setMedicines([]);
        return;
      }

      searchMedicine();
    }, 500);

    return () => clearTimeout(timer);
  }, [keyword]);

  const searchMedicine = async () => {
    try {
      setLoading(true);

      const res = await api.get(`/medicines/search?keyword=${keyword}`);

      setMedicines(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (medicine) => {
    onSelect?.(medicine);
    setKeyword("");
    setMedicines([]);
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="Search medicine..."
        className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-green-500"
      />

      {/* Search Result Dropdown */}
      {keyword && (
        <div className="absolute w-full bg-white border rounded-lg mt-2 shadow-lg max-h-64 overflow-y-auto z-50">
          {loading && (
            <p className="p-3 text-gray-500 text-sm">Searching...</p>
          )}

          {!loading && medicines.length === 0 && (
            <p className="p-3 text-gray-500 text-sm">
              No medicine found
            </p>
          )}

          {medicines.map((med) => (
            <div
              key={med._id}
              onClick={() => handleSelect(med)}
              className="p-3 hover:bg-gray-100 cursor-pointer border-b"
            >
              <p className="font-medium">{med.name}</p>
              <p className="text-xs text-gray-500">
                {med.genericName} | {med.company}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MedicineSearchBox;