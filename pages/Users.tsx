import React, { useState } from 'react';
import { Search, Filter, MoreVertical, UserCheck, UserX, Crown, Trash2, Edit, CreditCard, Plus, X, Camera, Save } from 'lucide-react';
import { MOCK_USERS } from '../services/mockData';
import { User } from '../types';

const UsersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkAction, setBulkAction] = useState<string>('');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<Partial<User>>({
    name: '', email: '', subscription: 'free', status: 'active', deviceCount: 0
  });

  const filteredUsers = users.filter(u => 
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Form Handling
  const handleOpenModal = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setFormData({ ...user });
    } else {
      setEditingUser(null);
      setFormData({ name: '', email: '', subscription: 'free', status: 'active', deviceCount: 0 });
    }
    setIsModalOpen(true);
    setActiveMenuId(null);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
        // Update
        setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...formData } as User : u));
    } else {
        // Create
        const newUser: User = {
            id: Math.random().toString(36).substr(2, 9),
            name: formData.name || 'New User',
            email: formData.email || '',
            status: formData.status as any,
            subscription: formData.subscription as any,
            deviceCount: 0,
            lastLogin: 'Never',
            avatar: formData.avatar
        };
        setUsers([...users, newUser]);
    }
    setIsModalOpen(false);
  };

  // Selection Logic
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(new Set(filteredUsers.map(u => u.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectOne = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  // Action Logic
  const handleDelete = (id: string) => {
      if(window.confirm('Are you sure?')) {
          setUsers(users.filter(u => u.id !== id));
          setActiveMenuId(null);
      }
  };

  const handleBulkAction = () => {
    if (selectedIds.size === 0) return;
    
    if (bulkAction === 'delete') {
      if (window.confirm(`Delete ${selectedIds.size} users?`)) {
        setUsers(users.filter(u => !selectedIds.has(u.id)));
        setSelectedIds(new Set());
      }
    } else if (bulkAction === 'ban') {
        setUsers(users.map(u => selectedIds.has(u.id) ? { ...u, status: 'banned' } : u));
        setSelectedIds(new Set());
    }
    setBulkAction('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">User Management</h2>
          <p className="text-slate-500">Manage user accounts and subscriptions.</p>
        </div>
        <div className="flex gap-3">
             <button 
                onClick={() => handleOpenModal()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 shadow-lg shadow-blue-500/30 flex items-center gap-2 transition-all">
                <Plus size={18} /> Add User
            </button>
            <button className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-600 font-medium flex items-center gap-2 hover:bg-slate-50">
                <Filter size={18} /> Filter
            </button>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedIds.size > 0 && (
        <div className="bg-indigo-50 border border-indigo-100 p-3 rounded-xl flex items-center justify-between animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-3">
                <span className="bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded-md">{selectedIds.size} Selected</span>
                <span className="text-sm text-indigo-900 font-medium">Actions:</span>
            </div>
            <div className="flex items-center gap-2">
                <select 
                    value={bulkAction} 
                    onChange={(e) => setBulkAction(e.target.value)}
                    className="text-sm border-indigo-200 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                    <option value="">Select Action...</option>
                    <option value="ban">Ban Selected</option>
                    <option value="delete">Delete Selected</option>
                </select>
                <button 
                    onClick={handleBulkAction}
                    disabled={!bulkAction}
                    className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                >
                    Apply
                </button>
            </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 min-h-[400px]">
        <div className="p-4 border-b border-slate-200">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                    type="text" 
                    placeholder="Search users by name or email..." 
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>
        <div className="overflow-visible">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-800 font-semibold uppercase text-xs">
              <tr>
                <th className="px-6 py-4 w-10">
                    <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        checked={filteredUsers.length > 0 && selectedIds.size === filteredUsers.length}
                        onChange={handleSelectAll}
                    />
                </th>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Subscription</th>
                <th className="px-6 py-4">Devices</th>
                <th className="px-6 py-4">Last Login</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((user) => (
                <tr key={user.id} className={`hover:bg-slate-50 transition-colors ${selectedIds.has(user.id) ? 'bg-blue-50/50' : ''}`}>
                   <td className="px-6 py-4">
                    <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        checked={selectedIds.has(user.id)}
                        onChange={() => handleSelectOne(user.id)}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                        {user.avatar ? (
                            <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full object-cover border border-slate-200" />
                        ) : (
                            <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold">
                                {user.name ? user.name[0].toUpperCase() : user.email[0].toUpperCase()}
                            </div>
                        )}
                        <div>
                            <div className="font-semibold text-slate-900">{user.name}</div>
                            <div className="text-xs text-slate-500">{user.email}</div>
                        </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                     <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                         user.status === 'active' ? 'bg-green-50 text-green-700 border-green-200' :
                         user.status === 'banned' ? 'bg-red-50 text-red-700 border-red-200' :
                         'bg-gray-100 text-gray-600 border-gray-200'
                     }`}>
                         {user.status === 'active' ? <UserCheck size={12}/> : <UserX size={12}/>}
                         {user.status.toUpperCase()}
                     </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                        {user.subscription !== 'free' && <Crown size={16} className="text-yellow-500" />}
                        <span className="capitalize">{user.subscription}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">{user.deviceCount} / {user.subscription === 'vip' ? '10' : '3'}</td>
                  <td className="px-6 py-4 font-mono text-xs">{user.lastLogin}</td>
                  <td className="px-6 py-4 text-right overflow-visible">
                    <div className="relative">
                        <button 
                            onClick={() => setActiveMenuId(activeMenuId === user.id ? null : user.id)}
                            className={`p-2 rounded-lg transition-colors ${activeMenuId === user.id ? 'bg-slate-200 text-slate-800' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}
                        >
                            <MoreVertical size={20} />
                        </button>

                        {activeMenuId === user.id && (
                             <>
                                 <div className="fixed inset-0 z-10 cursor-default" onClick={() => setActiveMenuId(null)}></div>
                                 <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-slate-100 z-20 py-1 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                                     <button onClick={() => handleOpenModal(user)} className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                                         <Edit size={16} /> Edit Details
                                     </button>
                                     <div className="h-px bg-slate-100 my-1"></div>
                                     <button onClick={() => handleDelete(user.id)} className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                                         <Trash2 size={16} /> Delete User
                                     </button>
                                 </div>
                             </>
                        )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

        {/* Add/Edit User Modal */}
        {isModalOpen && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                        <h3 className="text-lg font-bold text-slate-800">{editingUser ? 'Edit User' : 'Add New User'}</h3>
                        <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                            <X size={20} />
                        </button>
                    </div>
                    
                    <form onSubmit={handleSaveUser} className="p-6 space-y-4">
                        {/* Avatar Upload Placeholder */}
                        <div className="flex justify-center mb-4">
                            <div className="relative group cursor-pointer">
                                <div className="w-20 h-20 rounded-full bg-slate-100 border-2 border-slate-200 flex items-center justify-center overflow-hidden">
                                     {formData.avatar ? (
                                        <img src={formData.avatar} className="w-full h-full object-cover" alt="avatar" />
                                     ) : (
                                        <span className="text-2xl font-bold text-slate-400">{formData.name?.[0]?.toUpperCase() || 'U'}</span>
                                     )}
                                </div>
                                <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                    <Camera size={20} className="text-white" />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                            <input 
                                type="text" 
                                required
                                value={formData.name}
                                onChange={e => setFormData({...formData, name: e.target.value})}
                                className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="John Doe"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                            <input 
                                type="email" 
                                required
                                value={formData.email}
                                onChange={e => setFormData({...formData, email: e.target.value})}
                                className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="john@example.com"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Subscription</label>
                                <select 
                                    value={formData.subscription}
                                    onChange={e => setFormData({...formData, subscription: e.target.value as any})}
                                    className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                >
                                    <option value="free">Free</option>
                                    <option value="premium">Premium</option>
                                    <option value="vip">VIP</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                                <select 
                                    value={formData.status}
                                    onChange={e => setFormData({...formData, status: e.target.value as any})}
                                    className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                >
                                    <option value="active">Active</option>
                                    <option value="banned">Banned</option>
                                    <option value="expired">Expired</option>
                                </select>
                            </div>
                        </div>

                        <div className="pt-4 flex gap-3">
                            <button 
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="flex-1 py-2.5 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit"
                                className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-colors flex items-center justify-center gap-2"
                            >
                                <Save size={18} /> {editingUser ? 'Update User' : 'Create User'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )}
    </div>
  );
};

export default UsersPage;