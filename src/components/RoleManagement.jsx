import React, { useEffect, useState } from 'react';
import { fetchRoles, addRole, updateRole, deleteRole } from '../api/roles';
import { NavLink } from 'react-router-dom';

const RoleManagement = () => {
  const [roles, setRoles] = useState([]);
  const [roleForm, setRoleForm] = useState({ name: '', permissions: [] });
  const [permissions] = useState(['Read', 'Write', 'Delete']);
  const [editingId, setEditingId] = useState(null);

  // Fetch roles from the API
  const loadRoles = async () => {
    const data = await fetchRoles();
    setRoles(data);
  };

  useEffect(() => {
    loadRoles();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRoleForm({ ...roleForm, [name]: value });
  };

  // Toggle permission in the role form
  const handlePermissionToggle = (perm) => {
    setRoleForm((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(perm)
        ? prev.permissions.filter((p) => p !== perm)
        : [...prev.permissions, perm],
    }));
  };

  // Add a new role
  const handleAddRole = async () => {
    if (editingId) {
      // Update role if editing
      await updateRole(editingId, roleForm);
    } else {
      // Add new role
      await addRole(roleForm);
    }
    setRoleForm({ name: '', permissions: [] });
    setEditingId(null);
    loadRoles();
  };

  // Handle editing an existing role
  const handleEditRole = (role) => {
    setRoleForm(role);
    setEditingId(role.id);
  };

  // Handle deleting a role
  const handleDeleteRole = async (id) => {
    await deleteRole(id);
    loadRoles();
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Role Management</h1>

      {/* Role Form */}
      <div className="card p-4">
        <h3>{editingId ? 'Edit Role' : 'Add Role'}</h3>
        <div className="mb-3">
          <label htmlFor="roleName" className="form-label">
            Role Name
          </label>
          <input
            type="text"
            id="roleName"
            name="name"
            className="form-control"
            placeholder="Enter role name"
            value={roleForm.name}
            onChange={handleInputChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Permissions</label>
          <div>
            {permissions.map((perm) => (
              <div key={perm} className="form-check form-check-inline">
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={roleForm.permissions.includes(perm)}
                  onChange={() => handlePermissionToggle(perm)}
                />
                <label className="form-check-label">{perm}</label>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <NavLink
            to="/"
            className="btn btn-primary"
            onClick={handleAddRole}
          >
            {editingId ? 'Update Role' : 'Add Role'}
          </NavLink>
        </div>
      </div>

      {/* Roles List */}
      <div className="mt-4">
        <h3>Existing Roles</h3>
        <ul className="list-group">
          {roles.map((role) => (
            <li key={role.id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <strong>{role.name}</strong> - Permissions: {role.permissions.join(', ')}
              </div>
              <div>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => handleEditRole(role)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDeleteRole(role.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RoleManagement;
