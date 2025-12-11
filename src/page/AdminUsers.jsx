import { useEffect, useState, useCallback, useMemo } from "react";
import { Search, Trash2, Eye, Ban, CheckCircle, Users, ShieldBan, Wifi, WifiOff } from "lucide-react";
import api from "../api/api";
import socket from "../utils/socket";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [filterType, setFilterType] = useState("all");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState(null);

  // ✅ Socket.io real-time updates
  useEffect(() => {
    socket.on('user-online', (data) => {
      setUsers(prev => prev.map(user => 
        user._id === data.userId ? { ...user, isOnline: true } : user
      ));
    });
    
    socket.on('user-offline', (data) => {
      setUsers(prev => prev.map(user => 
        user._id === data.userId ? { ...user, isOnline: false } : user
      ));
    });

    return () => {
      socket.off('user-online');
      socket.off('user-offline');
    };
  }, []);

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/users");
      setUsers(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleAction = async (type, id) => {
    if (!selectedUser) return;
    setLoading(true);
    try {
      if (type === "block") await api.patch(`/admin/users/block/${id}`);
      else if (type === "unblock") await api.patch(`/admin/users/unblock/${id}`);
      else if (type === "delete") await api.delete(`/admin/user/${id}`);

      setSuccessMessage(`User ${type}ed successfully`);
      setTimeout(() => setSuccessMessage(""), 3000);

      setActionType(null);
      setSelectedUser(null);
      fetchUsers();
      if (type === "block") setFilterType("blocked");
      if (type === "unblock") setFilterType("online");
    } catch (err) {
      setError(err.response?.data?.message || "Action failed");
    }
    setLoading(false);
  };

  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const matchesSearch =
        (u.name?.toLowerCase() || "").includes(search.toLowerCase()) ||
        (u.email?.toLowerCase() || "").includes(search.toLowerCase());
      
      // ✅ NEW FILTER LOGIC WITH ONLINE STATUS
      if (filterType === "online") {
        return matchesSearch && u.isOnline === true && u.isBlocked === false;
      }
      if (filterType === "offline") {
        return matchesSearch && u.isOnline === false && u.isBlocked === false;
      }
      if (filterType === "blocked") {
        return matchesSearch && u.isBlocked === true;
      }
      if (filterType === "active") {
        return matchesSearch && u.isBlocked === false; // Legacy active (unblocked)
      }
      return matchesSearch; // "all"
    });
  }, [users, search, filterType]);

  const userCounts = useMemo(() => ({
    all: users.length,
    online: users.filter(u => u.isOnline === true && u.isBlocked === false).length,
    offline: users.filter(u => u.isOnline === false && u.isBlocked === false).length,
    blocked: users.filter(u => u.isBlocked === true).length,
    active: users.filter(u => !u.isBlocked).length
  }), [users]);

  const ActionModal = ({ isOpen, onClose, title, message, onConfirm, confirmText, confirmColor }) => {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-xl max-w-md w-full">
          <h2 className="text-xl mb-4 font-semibold">{title}</h2>
          <p className="mb-4">{message}</p>
          <div className="flex justify-end gap-3 mt-4">
            <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition" disabled={loading}>Cancel</button>
            <button onClick={onConfirm} className={`px-4 py-2 text-white rounded ${confirmColor} hover:opacity-90 transition`} disabled={loading}>{confirmText}</button>
          </div>
        </div>
      </div>
    );
  };

  // ✅ Status badge component
  const StatusBadge = ({ isBlocked, isOnline }) => {
    if (isBlocked) {
      return <span className="px-3 py-1 rounded-full bg-red-500 text-white text-sm font-semibold shadow">Blocked</span>;
    }
    if (isOnline) {
      return <span className="px-3 py-1 rounded-full bg-green-500 text-white text-sm font-semibold shadow">Online</span>;
    }
    return <span className="px-3 py-1 rounded-full bg-gray-500 text-white text-sm font-semibold shadow">Offline</span>;
  };

  return (
    <div className="p-6 mt-16 w-full max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Users Management</h1>

      {/* Messages */}
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
      {successMessage && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">{successMessage}</div>}

      {/* Filter Buttons - UPDATED WITH ONLINE/OFFLINE */}
      <div className="flex flex-wrap gap-4 mb-6">
        <button 
          onClick={() => setFilterType("all")} 
          className={`px-4 py-2 rounded-lg shadow flex items-center gap-2 transition ${filterType==="all"?"bg-blue-600 text-white hover:bg-blue-700":"bg-gray-200 hover:bg-gray-300"}`}
          disabled={loading}
        >
          <Users size={18}/> All Users <span className="ml-1 bg-white/30 px-2 py-0.5 rounded-full text-sm">{userCounts.all}</span>
        </button>
        <button 
          onClick={() => setFilterType("online")} 
          className={`px-4 py-2 rounded-lg shadow flex items-center gap-2 transition ${filterType==="online"?"bg-green-600 text-white hover:bg-green-700":"bg-gray-200 hover:bg-gray-300"}`}
          disabled={loading}
        >
          <Wifi size={18}/> Online Now <span className="ml-1 bg-white/30 px-2 py-0.5 rounded-full text-sm">{userCounts.online}</span>
        </button>
        <button 
          onClick={() => setFilterType("offline")} 
          className={`px-4 py-2 rounded-lg shadow flex items-center gap-2 transition ${filterType==="offline"?"bg-gray-600 text-white hover:bg-gray-700":"bg-gray-200 hover:bg-gray-300"}`}
          disabled={loading}
        >
          <WifiOff size={18}/> Offline Users <span className="ml-1 bg-white/30 px-2 py-0.5 rounded-full text-sm">{userCounts.offline}</span>
        </button>
        <button 
          onClick={() => setFilterType("blocked")} 
          className={`px-4 py-2 rounded-lg shadow flex items-center gap-2 transition ${filterType==="blocked"?"bg-red-600 text-white hover:bg-red-700":"bg-gray-200 hover:bg-gray-300"}`}
          disabled={loading}
        >
          <ShieldBan size={18}/> Blocked Users <span className="ml-1 bg-white/30 px-2 py-0.5 rounded-full text-sm">{userCounts.blocked}</span>
        </button>
        <button 
          onClick={() => setFilterType("active")} 
          className={`px-4 py-2 rounded-lg shadow flex items-center gap-2 transition ${filterType==="active"?"bg-emerald-600 text-white hover:bg-emerald-700":"bg-gray-200 hover:bg-gray-300"}`}
          disabled={loading}
        >
          <CheckCircle size={18}/> Active (Unblocked) <span className="ml-1 bg-white/30 px-2 py-0.5 rounded-full text-sm">{userCounts.active}</span>
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center bg-white p-3 rounded-xl shadow w-full max-w-md mb-6">
        <Search className="text-gray-500 w-5 h-5"/>
        <input 
          type="text" 
          placeholder="Search users..." 
          value={search} 
          onChange={e=>setSearch(e.target.value)} 
          className="ml-3 bg-transparent w-full outline-none"
          disabled={loading}
        />
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        {loading && users.length === 0 ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading users...</p>
          </div>
        ) : (
          <>
            <table className="w-full text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-6 font-semibold">Name</th>
                  <th className="py-3 px-6 font-semibold">Email</th>
                  <th className="py-3 px-6 font-semibold">Role</th>
                  <th className="py-3 px-6 font-semibold">Status</th>
                  <th className="py-3 px-6 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length===0 ? (
                  <tr><td colSpan={5} className="py-8 text-center text-gray-500">No users found</td></tr>
                ) : filteredUsers.map((u,i)=>(
                  <tr key={u._id} className={`transition rounded-lg ${i%2===0?"bg-white":"bg-gray-50"} hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100`}>
                    <td className="py-4 px-6">{u.name}</td>
                    <td className="py-4 px-6">{u.email}</td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-white text-sm font-semibold ${u.role==="ADMIN"?"bg-red-600":u.role==="DOCTOR"?"bg-blue-600":"bg-green-600"}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <StatusBadge isBlocked={u.isBlocked} isOnline={u.isOnline} />
                    </td>
                    <td className="py-4 px-6 flex gap-3">
                      <button title="View" onClick={()=>{setSelectedUser(u); setActionType("view")}} className="p-2 hover:bg-blue-50 rounded text-blue-600 hover:text-blue-700" disabled={loading}><Eye size={24}/></button>
                      {u.isBlocked ? 
                        <button title="Unblock" onClick={()=>{setSelectedUser(u); setActionType("unblock")}} className="p-2 hover:bg-green-50 rounded text-green-600 hover:text-green-700" disabled={loading}><CheckCircle size={18}/></button> :
                        <button title="Block" onClick={()=>{setSelectedUser(u); setActionType("block")}} className="p-2 hover:bg-yellow-50 rounded text-yellow-600 hover:text-yellow-700" disabled={loading}><Ban size={24}/></button>
                      }
                      <button title="Delete" onClick={()=>{setSelectedUser(u); setActionType("delete")}} className="p-2 hover:bg-red-50 rounded text-red-600 hover:text-red-700" disabled={loading}><Trash2 size={24}/></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-4 pt-4 border-t text-sm text-gray-600 px-6 pb-4">
              Showing <span className="font-semibold">{filteredUsers.length}</span> of <span className="font-semibold">{userCounts.all}</span> users
              {search && ` matching "${search}"`}
              <div className="text-xs mt-1">
                Online: {userCounts.online} | Offline: {userCounts.offline} | Blocked: {userCounts.blocked}
              </div>
            </div>
          </>
        )}
      </div>

      {/* View Modal - UPDATED WITH ONLINE STATUS */}
      {selectedUser && actionType==="view" && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl max-w-md w-full relative">
            <button className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 p-1" onClick={()=>setSelectedUser(null)} disabled={loading}>✖</button>
            <h2 className="text-2xl font-semibold mb-4">User Details</h2>
            <div className="space-y-3">
              <p><strong>Name:</strong> {selectedUser.name}</p>
              <p><strong>Email:</strong> {selectedUser.email}</p>
              <p><strong>Role:</strong> {selectedUser.role}</p>
              <p><strong>Status:</strong> <StatusBadge isBlocked={selectedUser.isBlocked} isOnline={selectedUser.isOnline} /></p>
              <p><strong>Online Status:</strong> {selectedUser.isOnline ? "🟢 Currently Online" : "⚫ Currently Offline"}</p>
              {selectedUser.lastActive && (
                <p><strong>Last Active:</strong> {new Date(selectedUser.lastActive).toLocaleString()}</p>
              )}
              <p className="text-xs text-gray-500"><strong>User ID:</strong> {selectedUser._id}</p>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Action Modal */}
      <ActionModal
        isOpen={!!(selectedUser && actionType && actionType!=="view")}
        onClose={()=>{setSelectedUser(null); setActionType(null)}}
        title={`Confirm ${actionType} User`}
        message={`Are you sure you want to ${actionType} user "${selectedUser?.name}"?`}
        onConfirm={()=>handleAction(actionType, selectedUser?._id)}
        confirmText={loading ? "Processing..." : `Yes, ${actionType}`}
        confirmColor={actionType==="delete"?"bg-red-500 hover:bg-red-600":"bg-yellow-500 hover:bg-yellow-600"}
      />
    </div>
  );
};

export default AdminUsers;