import DepartmentActions from "./DepartmentActions";
import { Calendar, Users } from "lucide-react";

export default function DepartmentRow({ department, onRefresh }) {

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get department icon based on name
  const getDepartmentIcon = (name) => {
    const firstChar = name?.charAt(0)?.toUpperCase() || "D";
    
    // Color based on department name
    const colors = {
      'C': 'from-blue-100 to-blue-200 text-blue-600', // Cardiology
      'N': 'from-purple-100 to-purple-200 text-purple-600', // Neurology
      'O': 'from-green-100 to-green-200 text-green-600', // Orthopedics
      'P': 'from-pink-100 to-pink-200 text-pink-600', // Pediatrics
      'D': 'from-amber-100 to-amber-200 text-amber-600', // Dermatology
      'G': 'from-teal-100 to-teal-200 text-teal-600', // Gynecology
      'default': 'from-gray-100 to-gray-200 text-gray-600'
    };
    
    return {
      char: firstChar,
      colorClass: colors[firstChar] || colors.default
    };
  };

  const icon = getDepartmentIcon(department.name);

  return (
    <tr className="border-b hover:bg-gray-50 transition-colors duration-150 group">
      <td className="py-4 px-6">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${icon.colorClass} flex items-center justify-center shadow-sm`}>
            <span className="font-bold text-xl">
              {icon.char}
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-semibold text-gray-900 text-base">
                {department.name || "—"}
              </p>
              {department.status === "active" ? (
                <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                  Active
                </span>
              ) : (
                <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                  Inactive
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 mt-2">
              <div className="flex items-center gap-1 text-gray-500 text-sm">
                <Users className="w-3.5 h-3.5" />
                <span>{department.doctorCount || 0} doctors</span>
              </div>
              <div className="flex items-center gap-1 text-gray-500 text-sm">
                <Calendar className="w-3.5 h-3.5" />
                <span>{formatDate(department.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </td>
      
      <td className="py-4 px-6">
        <div className="max-w-xs">
          <p className="text-gray-600 line-clamp-2">
            {department.description || "No description provided"}
          </p>
          {department.image && (
            <span className="inline-block mt-1 px-2 py-0.5 bg-blue-50 text-blue-600 text-xs rounded">
              Has Image
            </span>
          )}
        </div>
      </td>
      
      <td className="py-4 px-6">
        <div className="flex flex-col">
          <span className="text-gray-600 font-medium">
            {formatDate(department.createdAt)}
          </span>
          <span className="text-gray-400 text-sm">
            {department.createdAt ? "Created" : "—"}
          </span>
        </div>
      </td>
      
      <td className="py-4 px-6">
        <div className="flex items-center gap-3">
          <div className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
            department.status === "active"
              ? "bg-green-100 text-green-700 hover:bg-green-200"
              : "bg-red-100 text-red-700 hover:bg-red-200"
          }`}>
            {department.status === "active" ? (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Active</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span>Inactive</span>
              </div>
            )}
          </div>
        </div>
      </td>
      
      <td className="py-4 px-6">
        <DepartmentActions 
          department={department} 
          onRefresh={onRefresh} 
        />
      </td>
    </tr>
  );
}