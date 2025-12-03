const VISIBLE_OPTIONS = [
  { key: "all", label: "All" },
  { key: "patient", label: "Patients" },
  { key: "doctor", label: "Doctors" },
  { key: "staff", label: "Staff" },
];

export default function NoticeFilters({ search, setSearch, filterVisible, setFilterVisible, onRefresh }) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      <input
        type="text"
        placeholder="Search notices..."
        className="border px-3 py-2 rounded w-56"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <select
        value={filterVisible}
        onChange={(e) => setFilterVisible(e.target.value)}
        className="border px-3 py-2 rounded"
      >
        {VISIBLE_OPTIONS.map(o => <option key={o.key} value={o.key}>{o.label}</option>)}
      </select>

      <button
        onClick={onRefresh}
        className="px-3 py-2 border rounded hover:bg-gray-100"
        title="Refresh"
      >
        Refresh
      </button>
    </div>
  );
}
