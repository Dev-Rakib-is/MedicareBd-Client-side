import { MoreVertical, Eye, Pencil, Trash2, Power, Copy, X } from "lucide-react";
import { useState } from "react";
import api from "../../api/api"; 

export default function DepartmentActions({ department, onRefresh }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleAction = async (action, id) => {
    setShowDropdown(false);
    
    try {
      switch (action) {
        case 'view':
          // ✅ View 
          window.open(`/admin/departments/${id}`, '_blank');
          break;
          
        case 'edit':
          // ✅ Edit 
          alert(`Edit department: ${id} - এখানে Edit মডাল ওপেন করবেন`);
          break;
          
        case 'duplicate':
          // ✅ Duplicate API কল
          await api.post(`/departments/${id}/duplicate`);
          onRefresh();
          break;
          
        case 'toggleStatus':
          const newStatus = department.status === "active" ? "inactive" : "active";
          await api.put(`/departments/${id}`, { 
            status: newStatus 
          });
          onRefresh();
          break;
          
        case 'delete':
          setShowDeleteConfirm(true);
          break;
          
        default:
          console.warn('Unknown action:', action);
      }
    } catch (error) {
      console.error(`${action} action failed:`, error);
      alert(`Error: ${error.response?.data?.message || error.message}`);
    }
  };

  const confirmDelete = async (id) => {
    try {
      await api.delete(`/departments/${id}`);
      onRefresh();
      alert("Department deleted successfully!");
    } catch (error) {
      console.error("Delete failed:", error);
      alert(`Delete failed: ${error.response?.data?.message || error.message}`);
    } finally {
      setShowDeleteConfirm(false);
    }
  };

  return (
    <>
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Actions"
          onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
        >
          <MoreVertical className="w-5 h-5" />
        </button>

        {showDropdown && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 z-50 py-1">
            <button
              onClick={() => handleAction('view', department._id)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-left hover:text-blue-600"
            >
              <Eye className="w-4 h-4 text-gray-600 group-hover:text-blue-600" />
              <span className="text-sm">View Details</span>
            </button>
            
            <button
              onClick={() => handleAction('edit', department._id)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-left hover:text-blue-600"
            >
              <Pencil className="w-4 h-4 text-blue-600" />
              <span className="text-sm">Edit</span>
            </button>
            
            <button
              onClick={() => handleAction('duplicate', department._id)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-left hover:text-purple-600"
            >
              <Copy className="w-4 h-4 text-purple-600" />
              <span className="text-sm">Duplicate</span>
            </button>
            
            <button
              onClick={() => handleAction('toggleStatus', department._id)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-left"
            >
              <Power className={`w-4 h-4 ${department.status === 'active' ? 'text-green-600' : 'text-gray-600'}`} />
              <span className="text-sm">
                {department.status === 'active' ? 'Deactivate' : 'Activate'}
              </span>
            </button>
            
            <div className="border-t my-1"></div>
            
            <button
              onClick={() => handleAction('delete', department._id)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 text-red-600 text-left"
            >
              <Trash2 className="w-4 h-4" />
              <span className="text-sm">Delete Department</span>
            </button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl max-w-sm w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">Confirm Delete</h3>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <strong>"{department.name}"</strong>? 
              This action cannot be undone.
            </p>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => confirmDelete(department._id)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}