import { apiClient } from './api';

// Mock data with advanced CRM fields for development
const mockLeads = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@acme.com',
    phone: '+91-98765-43210',
    company: 'Acme Corp',
    jobTitle: 'CEO',
    status: 'qualified',
    source: 'website',
    owner: 'Sarah Smith',
    manualLeadScore: 85,
    leadScore: 82,
    minBudget: '5000000',
    maxBudget: '25000000',
    priority: 'high',
    industry: 'technology',
    companySize: 'enterprise',
    expectedClosureDate: '2024-03-15',
    productInterests: ['crm_software', 'analytics_platform', 'automation_tools'],
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-18T14:30:00Z',
  },
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@techcorp.com',
    phone: '+91-87654-32109',
    company: 'TechCorp Inc',
    jobTitle: 'CTO',
    status: 'contacted',
    source: 'referral',
    owner: 'Mike Johnson',
    manualLeadScore: 70,
    leadScore: 65,
    minBudget: '2500000',
    maxBudget: '5000000',
    priority: 'medium',
    industry: 'technology',
    companySize: 'mid_market',
    expectedClosureDate: '',
    productInterests: ['erp_solution', 'integration_services'],
    createdAt: '2024-01-16T09:15:00Z',
    updatedAt: '2024-01-17T11:20:00Z',
  },
  {
    id: '3',
    firstName: 'Bob',
    lastName: 'Wilson',
    email: 'bob.wilson@healthcare.com',
    phone: '+91-76543-21098',
    company: 'HealthCare Solutions',
    jobTitle: 'Director',
    status: 'new',
    source: 'cold_call',
    owner: 'Lisa Brown',
    manualLeadScore: 0,
    leadScore: 35,
    minBudget: '500000',
    maxBudget: '2500000',
    priority: 'low',
    industry: 'healthcare',
    companySize: 'smb',
    expectedClosureDate: '',
    productInterests: ['crm_software'],
    createdAt: '2024-01-17T14:45:00Z',
    updatedAt: '2024-01-17T14:45:00Z',
  },
  {
    id: '4',
    firstName: 'Alice',
    lastName: 'Johnson',
    email: 'alice.johnson@finance.com',
    phone: '+91-65432-10987',
    company: 'Finance Pro',
    jobTitle: 'VP Finance',
    status: 'converted',
    source: 'trade_show',
    owner: 'David Lee',
    manualLeadScore: 95,
    leadScore: 92,
    minBudget: '25000000',
    maxBudget: '50000000',
    priority: 'critical',
    industry: 'finance',
    companySize: 'enterprise',
    expectedClosureDate: '2024-02-28',
    productInterests: ['erp_solution', 'analytics_platform', 'consulting_services', 'custom_development'],
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2024-01-20T16:30:00Z',
  },
];

export const leadsService = {
  // Get all leads with filters, sorting, pagination
  getLeads: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      return await apiClient.get(`/leads${queryString ? `?${queryString}` : ''}`);
    } catch (error) {
      // Fallback to mock data
      console.log('Using mock data for leads');
      return { data: mockLeads, pagination: { page: 1, total: mockLeads.length, pageSize: 10 } };
    }
  },

  // Get single lead by ID
  getLead: async (id) => {
    try {
      return await apiClient.get(`/leads/${id}`);
    } catch (error) {
      // Fallback to mock data
      const lead = mockLeads.find(l => l.id === id);
      if (lead) return lead;
      throw new Error('Lead not found');
    }
  },

  // Create new lead
  createLead: async (data) => {
    try {
      return await apiClient.post('/leads', data);
    } catch (error) {
      // Simulate creation with mock data
      const newLead = { ...data, id: Date.now().toString(), createdAt: new Date().toISOString() };
      mockLeads.push(newLead);
      return newLead;
    }
  },

  // Update existing lead
  updateLead: async (id, data) => {
    try {
      return await apiClient.put(`/leads/${id}`, data);
    } catch (error) {
      // Simulate update with mock data
      const index = mockLeads.findIndex(l => l.id === id);
      if (index !== -1) {
        mockLeads[index] = { ...mockLeads[index], ...data, updatedAt: new Date().toISOString() };
        return mockLeads[index];
      }
      throw new Error('Lead not found');
    }
  },

  // Delete lead
  deleteLead: async (id) => {
    try {
      return await apiClient.delete(`/leads/${id}`);
    } catch (error) {
      // Simulate deletion with mock data
      const index = mockLeads.findIndex(l => l.id === id);
      if (index !== -1) {
        mockLeads.splice(index, 1);
        return { success: true };
      }
      throw new Error('Lead not found');
    }
  },

  // Get lead timeline (notes, status changes, etc.)
  getLeadTimeline: async (id) => {
    try {
      return await apiClient.get(`/leads/${id}/timeline`);
    } catch (error) {
      // Return mock timeline data
      return getMockTimeline();
    }
  },

  // Add note to lead
  addNote: async (id, note) => {
    try {
      return await apiClient.post(`/leads/${id}/notes`, { note });
    } catch (error) {
      // Simulate note addition
      return { success: true, note };
    }
  },

  // Add timeline event
  addTimelineEvent: async (id, event) => {
    try {
      return await apiClient.post(`/leads/${id}/timeline`, event);
    } catch (error) {
      // Simulate timeline event addition
      return { success: true, event };
    }
  },

  // Change lead status
  changeStatus: async (id, status) => {
    try {
      return await apiClient.put(`/leads/${id}/status`, { status });
    } catch (error) {
      // Simulate status change with mock data
      const index = mockLeads.findIndex(l => l.id === id);
      if (index !== -1) {
        mockLeads[index].status = status;
        mockLeads[index].updatedAt = new Date().toISOString();
        return mockLeads[index];
      }
      throw new Error('Lead not found');
    }
  },

  // Assign lead to owner
  assignOwner: async (id, ownerId) => {
    try {
      return await apiClient.put(`/leads/${id}/assign`, { ownerId });
    } catch (error) {
      // Simulate assignment with mock data
      const index = mockLeads.findIndex(l => l.id === id);
      if (index !== -1) {
        mockLeads[index].ownerId = ownerId;
        mockLeads[index].updatedAt = new Date().toISOString();
        return mockLeads[index];
      }
      throw new Error('Lead not found');
    }
  },
};

// Mock timeline data
const getMockTimeline = () => [
  {
    type: 'created',
    title: 'Lead Created',
    description: 'Lead was created in the system',
    timestamp: '2024-01-15T10:30:00Z',
    user: 'Sarah Smith',
  },
  {
    type: 'score_update',
    title: 'Lead Score Updated',
    description: 'Lead score automatically calculated: 45 points',
    timestamp: '2024-01-15T10:31:00Z',
    user: 'System',
  },
  {
    type: 'note',
    title: 'Note Added',
    description: 'Initial contact made via email. Interested in enterprise plan.',
    timestamp: '2024-01-15T14:20:00Z',
    user: 'Sarah Smith',
  },
  {
    type: 'status_change',
    title: 'Status Changed',
    description: 'Status changed from New to Contacted',
    timestamp: '2024-01-16T09:15:00Z',
    user: 'Sarah Smith',
    metadata: { fromStatus: 'new', toStatus: 'contacted' }
  },
];
