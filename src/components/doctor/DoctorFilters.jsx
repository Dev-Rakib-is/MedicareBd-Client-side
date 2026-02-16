import { Search, Grid, Menu } from "lucide-react";

const DoctorFilters = ({ filters, setFilters, specializations }) => {
  const {
    search,
    selectedSpec,
    selectedSort,
    selectedAvailability,
    selectedExperience,
    priceRange,
    viewMode,
  } = filters;

  const handlePriceChange = (value) => {
    setFilters({ ...filters, priceRange: [0, parseInt(value)] });
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      selectedSpec: "",
      selectedSort: "recommended",
      selectedAvailability: "all",
      selectedExperience: "all",
      priceRange: [0, 5000],
      viewMode: "grid",
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Search */}
        <div className="lg:col-span-2">
          <div className="relative">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by doctor name, specialization, or qualification..."
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-0"
              value={search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
            />
          </div>
        </div>

        {/* Specialization */}
        <div>
          <select
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={selectedSpec}
            onChange={(e) =>
              setFilters({ ...filters, selectedSpec: e.target.value })
            }
          >
            <option value="">All Specializations</option>
            {Array.isArray(specializations) &&
              specializations.map((sp) => (
                <option key={sp._id || sp.name} value={sp.name}>
                  {sp.name} {sp.count && `(${sp.count})`}
                </option>
              ))}
          </select>
        </div>

        {/* Sort */}
        <div>
          <select
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={selectedSort}
            onChange={(e) =>
              setFilters({ ...filters, selectedSort: e.target.value })
            }
          >
            <option value="recommended">Recommended</option>
            <option value="rating">Highest Rated</option>
            <option value="experience">Most Experienced</option>
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
          </select>
        </div>

        {/* Additional Filters */}
        <div className="lg:col-span-4 grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {/* Availability */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Availability
            </label>
            <div className="flex gap-2">
              {["all", "online", "today"].map((type) => (
                <button
                  key={type}
                  className={`px-3 py-1.5 rounded-lg text-sm transition ${
                    selectedAvailability === type
                      ? "bg-blue-600 text-white shadow"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  onClick={() =>
                    setFilters({ ...filters, selectedAvailability: type })
                  }
                >
                  {type === "all"
                    ? "All"
                    : type === "online"
                      ? "Online Now"
                      : "Available Today"}
                </button>
              ))}
            </div>
          </div>

          {/* Experience */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Experience
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={selectedExperience}
              onChange={(e) =>
                setFilters({ ...filters, selectedExperience: e.target.value })
              }
            >
              <option value="all">Any Experience</option>
              <option value="0-5">0-5 years</option>
              <option value="5-10">5-10 years</option>
              <option value="10-15">10-15 years</option>
              <option value="15-100">15+ years</option>
            </select>
          </div>

          {/* Price Range */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-gray-700">
                Fee Range: {priceRange[0]}৳ - {priceRange[1]}৳
              </label>
              <button
                onClick={() =>
                  setFilters({ ...filters, priceRange: [0, 5000] })
                }
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                Reset
              </button>
            </div>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0"
                max="5000"
                step="100"
                value={priceRange[1]}
                onChange={(e) => handlePriceChange(e.target.value)}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600"
              />
              <span className="text-sm font-medium text-gray-700 min-w-[80px] text-right">
                {priceRange[1]}৳
              </span>
            </div>
          </div>
        </div>

        {/* View Mode & Actions */}
        <div className="lg:col-span-4 flex justify-between items-center mt-6 pt-6 border-t border-gray-200">
          <div className="text-gray-600">
            <button
              onClick={clearFilters}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear All Filters
            </button>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 hidden md:block">View:</span>
            <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
              <button
                className={`p-2 rounded transition ${viewMode === "grid" ? "bg-white text-blue-600 shadow" : "text-gray-500 hover:text-gray-700"}`}
                onClick={() => setFilters({ ...filters, viewMode: "grid" })}
                title="Grid View"
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                className={`p-2 rounded transition ${viewMode === "list" ? "bg-white text-blue-600 shadow" : "text-gray-500 hover:text-gray-700"}`}
                onClick={() => setFilters({ ...filters, viewMode: "list" })}
                title="List View"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorFilters;
