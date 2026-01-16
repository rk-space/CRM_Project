// Lead Status Configuration
export const STATUS_CONFIG = {
  new: {
    value: 'new',
    label: 'New',
    bgColor: '#dbeafe',
    textColor: '#1e40af',
  },
  contacted: {
    value: 'contacted',
    label: 'Contacted',
    bgColor: '#e0e7ff',
    textColor: '#5b21b6',
  },
  qualified: {
    value: 'qualified',
    label: 'Qualified',
    bgColor: '#d1fae5',
    textColor: '#065f46',
  },
  unqualified: {
    value: 'unqualified',
    label: 'Unqualified',
    bgColor: '#fee2e2',
    textColor: '#991b1b',
  },
  converted: {
    value: 'converted',
    label: 'Converted',
    bgColor: '#d1fae5',
    textColor: '#047857',
  },
};

export const LEAD_STATUSES = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'qualified', label: 'Qualified' },
  { value: 'unqualified', label: 'Unqualified' },
  { value: 'converted', label: 'Converted' },
];

export const LEAD_SOURCES = [
  { value: '', label: 'Select Source' },
  { value: 'website', label: 'Website' },
  { value: 'referral', label: 'Referral' },
  { value: 'social_media', label: 'Social Media' },
  { value: 'email_campaign', label: 'Email Campaign' },
  { value: 'cold_call', label: 'Cold Call' },
  { value: 'trade_show', label: 'Trade Show' },
  { value: 'partner', label: 'Partner' },
  { value: 'other', label: 'Other' },
];

// Timeline Event Configuration
export const TIMELINE_EVENT_CONFIG = {
  created: {
    label: 'Created',
    icon: '✓',
    bgColor: '#059669',
  },
  status_change: {
    label: 'Status',
    icon: '↻',
    bgColor: '#8b5cf6',
  },
  assignment: {
    label: 'Assigned',
    icon: '👤',
    bgColor: '#10b981',
  },
  note: {
    label: 'Note',
    icon: '📝',
    bgColor: '#3b82f6',
  },
  updated: {
    label: 'Updated',
    icon: '✎',
    bgColor: '#f59e0b',
  },
  email_sent: {
    label: 'Email',
    icon: '✉',
    bgColor: '#06b6d4',
  },
  call_logged: {
    label: 'Call',
    icon: '📞',
    bgColor: '#ec4899',
  },
  meeting_scheduled: {
    label: 'Meeting',
    icon: '📅',
    bgColor: '#6366f1',
  },
  converted: {
    label: 'Converted',
    icon: '★',
    bgColor: '#10b981',
  },
  default: {
    label: 'Event',
    icon: '•',
    bgColor: '#6b7280',
  },
};

// Permission Keys
export const PERMISSIONS = {
  LEADS_VIEW: 'leads.view',
  LEADS_CREATE: 'leads.create',
  LEADS_EDIT: 'leads.edit',
  LEADS_DELETE: 'leads.delete',
  LEADS_ASSIGN: 'leads.assign',
  LEADS_CHANGE_STATUS: 'leads.changeStatus',
  DASHBOARD_VIEW: 'dashboard.view',
};
