// Lead Status Configuration
export const STATUS_CONFIG = {
  new: { label: 'New', bgColor: '#dbeafe', textColor: '#1e40af' },
  contacted: { label: 'Contacted', bgColor: '#e0e7ff', textColor: '#5b21b6' },
  qualified: { label: 'Qualified', bgColor: '#d1fae5', textColor: '#065f46' },
  unqualified: { label: 'Unqualified', bgColor: '#fee2e2', textColor: '#991b1b' },
  converted: { label: 'Converted', bgColor: '#ecfdf5', textColor: '#047857' },
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