import { Filter } from "lucide-react";
import DepartmentRow from "./DepartmentRow";

export default function DepartmentTable({ departments, loading, onRefresh }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="py-4 px-6 text-left font-semibold text-gray-700">
                Department
              </th>
              <th className="py-4 px-6 text-left font-semibold text-gray-700">
                Description
              </th>
              <th className="py-4 px-6 text-left font-semibold text-gray-700">
                Created
              </th>
              <th className="py-4 px-6 text-left font-semibold text-gray-700">
                Status
              </th>
              <th className="py-4 px-6 text-left font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="py-12 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-gray-500">Loading departments...</p>
                  </div>
                </td>
              </tr>
            ) : departments.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-12 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <Filter className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-lg font-medium">
                      No departments found
                    </p>
                    <p className="text-gray-400 mt-2">
                      Try adjusting your search or filter
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              departments.map((dept) => (
                <DepartmentRow key={dept._id} department={dept} onRefresh={onRefresh} />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}