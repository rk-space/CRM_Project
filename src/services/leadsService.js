import { apiClient } from './api';

export const leadsService = {
  // Get all leads with filters, sorting, pagination
  getLeads: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiClient.get(`/leads${queryString ? `?${queryString}` : ''}`);
  },

  // Get single lead by ID
  getLead: async (id) => {
    return apiClient.get(`/leads/${id}`);
  },

  // Create new lead
  createLead: async (data) => {
    return apiClient.post('/leads', data);
  },

  // Update existing lead
  updateLead: async (id, data) => {
    return apiClient.put(`/leads/${id}`, data);
  },

  // Delete lead
  deleteLead: async (id) => {
    return apiClient.delete(`/leads/${id}`);
  },

  // Get lead timeline (notes, status changes, etc.)
  getLeadTimeline: async (id) => {
    return apiClient.get(`/leads/${id}/timeline`);
  },

  // Add note to lead
  addNote: async (id, note) => {
    return apiClient.post(`/leads/${id}/notes`, { note });
  },

  // Change lead status
  changeStatus: async (id, status) => {
    return apiClient.put(`/leads/${id}/status`, { status });
  },

  // Assign lead to owner
  assignOwner: async (id, ownerId) => {
    return apiClient.put(`/leads/${id}/assign`, { ownerId });
  },
};
