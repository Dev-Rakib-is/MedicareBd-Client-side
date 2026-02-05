import { useState, useEffect } from "react";
import api from "../api/api";
import DepartmentFilters from "../components/adminDepartment/DepartmentFilters";
import DepartmentTable from "../components/adminDepartment/DepartmentTable";
import AddDepartmentModal from "../components/adminDepartment/AddDepartmentModal";
import { Building, Plus } from "lucide-react";
import Swal from "sweetalert2";

export default function AdminDepartmentsPage() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchDepartments();
  }, []);

  // Fetch all departments
  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const res = await api.get("/departments");
      const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
      setDepartments(data);
    } catch (error) {
      console.error("Failed to load departments:", error);
      Swal.fire({
        icon: "error",
        title: "Failed to load departments",
        text: error.response?.data?.message || "Check console for details",
      });
    } finally {
      setLoading(false);
    }
  };

  // Create new department
  const handleCreateDepartment = async (formData) => {
    try {
      const response = await api.post("/departments", formData);

      if (response.data.success) {
        await Swal.fire({
          icon: "success",
          title: "Department Created",
          text: "The department has been created successfully.",
          confirmButtonColor: "#2563eb",
        });
        setShowAddModal(false);
        fetchDepartments();
      }
    } catch (error) {
      console.error("Create failed:", error);
      Swal.fire({
        icon: "error",
        title: "Creation Failed",
        text: error.response?.data?.message || "Something went wrong.",
      });
    }
  };

  // Stats calculation
  const stats = {
    total: departments.length,
    active: departments.filter((d) => d.status === "active").length,
    inactive: departments.filter((d) => d.status === "inactive").length,
  };

  // Filtered departments
  const filteredDepartments = departments.filter((dept) => {
    const matchesSearch =
      dept.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || dept.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="mt-16 bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Building className="w-10 h-10 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Departments</h1>
              <p className="text-gray-600 mt-1">
                Manage all hospital departments and their settings
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            Add New Department
          </button>
        </div>

        {/* Status cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Departments</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.total}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <div className="w-6 h-6 rounded-full bg-blue-500"></div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Active</p>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  {stats.active}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Inactive</p>
                <p className="text-3xl font-bold text-red-600 mt-2">
                  {stats.inactive}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Table */}
      <DepartmentFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        onRefresh={fetchDepartments}
        loading={loading}
      />

      <DepartmentTable
        departments={filteredDepartments}
        loading={loading}
        onRefresh={fetchDepartments}
      />

      {/* Add Department Modal */}
      <AddDepartmentModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleCreateDepartment}
      />
    </div>
  );
}
