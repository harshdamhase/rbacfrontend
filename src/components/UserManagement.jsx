import React, { useEffect, useState } from "react";
import { fetchUsers, addUser, updateUser, deleteUser } from "../api/users";
import { fetchRoles } from "../api/roles";
import { NavLink } from "react-router-dom";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]); 
  const [form, setForm] = useState({ name: "", role: "", status: "Active" });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await fetchUsers();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadRoles = async () => {
    try {
      const data = await fetchRoles();
      setRoles(data); 
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  useEffect(() => {
    loadUsers();
    loadRoles();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        await updateUser(editingId, form);
      } else {
        await addUser(form);
      }
      setForm({ name: "", role: "", status: "Active" });
      setEditingId(null);
      loadUsers();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteUser(id);
      loadUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleEdit = (user) => {
    setForm(user);
    setEditingId(user.id);
  };

  const hasPermission = (user, permission) => {
    const userRole = roles.find((role) => role.name === user.role);
    return userRole && userRole.permissions.includes(permission);
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">User Management</h1>

      {/* User Form */}
      <div className="card p-4 mb-4">
        <form onSubmit={handleSubmit} className="row">
          <div className="col-md-4 mb-3">
            <input
              type="text"
              name="name"
              required
              placeholder="Name"
              value={form.name}
              onChange={handleInputChange}
              className="form-control"
            />
          </div>
          <div className="col-md-4 mb-3">
            <select
              name="role"
              value={form.role}
              required
              onChange={handleInputChange}
              className="form-select"
            >
              <option value="" disabled>
                Select Role
              </option>
              {roles.map((role) => (
                <option key={role.id} value={role.name}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-2 mb-3">
            <select
              name="status"
              value={form.status}
              onChange={handleInputChange}
              required
              className="form-select"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div className="col-md-2 mb-3 d-flex align-items-end">
            <button
              className="btn btn-success w-100"
              type="submit"
              disabled={loading}
            >
              {loading ? "Submitting..." : editingId ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>

      {/* User Table */}
      <div className="table-responsive">
        <table className="table table-bordered table-striped">
          <thead>
            <tr>
                <th></th>
                <th></th>
                <th></th>
                <th> <NavLink to="/roles" className="btn btn-primary btn-sm">
                  Add New Role
                </NavLink></th>
            </tr>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Status</th>
              <th>
               Action
              </th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.role}</td>
                  <td>{user.status}</td>
                  <td>
                    {user.status === "Active" ? (
                      <>
                        {hasPermission(user, "Write") && (
                          <button
                            className="btn btn-info btn-sm me-2"
                            onClick={() => handleEdit(user)}
                          >
                            Edit
                          </button>
                        )}
                        {hasPermission(user, "Delete") && (
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(user.id)}
                          >
                            Delete
                          </button>
                        )}
                      </>
                    ) : (
                      <p className="text-muted">User is Inactive</p>
                    )}
                    {user.status === "Active" &&
                      !hasPermission(user, "Write") &&
                      !hasPermission(user, "Delete") && (
                        <p className="text-warning">No permission to edit or delete</p>
                      )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
