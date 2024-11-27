import axios from 'axios';

const API_URL = 'http://localhost:5000/roles';

// Fetch all roles
export const fetchRoles = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching roles:', error);
    throw error;
  }
};

// Add a new role
export const addRole = async (role) => {
  try {
    const response = await axios.post(API_URL, role);
    return response.data;
  } catch (error) {
    console.error('Error adding role:', error);
    throw error;
  }
};

// Update a role
export const updateRole = async (id, updatedRole) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, updatedRole);
    return response.data;
  } catch (error) {
    console.error('Error updating role:', error);
    throw error;
  }
};

// Delete a role
export const deleteRole = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error('Error deleting role:', error);
    throw error;
  }
};
