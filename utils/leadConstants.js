// CRM Lead Constants - Enterprise Configuration
export const LEAD_SCORE_THRESHOLDS = {
  QUALIFIED_MIN: 60,
  HIGH_PRIORITY_MIN: 80,
  CONVERSION_MIN: 70,
};

export const BUDGET_RANGES = [
  { value: '', label: 'Select Budget Range' },
  { value: '0-500000', label: '₹0 - ₹5,00,000' },
  { value: '500000-2500000', label: '₹5,00,000 - ₹25,00,000' },
  { value: '2500000-5000000', label: '₹25,00,000 - ₹50,00,000' },
  { value: '5000000-25000000', label: '₹50,00,000 - ₹2,50,00,000' },
  { value: '25000000+', label: '₹2,50,00,000+' },
];

export const PRIORITY_LEVELS = [
  { value: '', label: 'Select Priority' },
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'critical', label: 'Critical' },
];

export const INDUSTRIES = [
  { value: '', label: 'Select Industry' },
  { value: 'technology', label: 'Technology' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'finance', label: 'Finance' },
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'retail', label: 'Retail' },
  { value: 'education', label: 'Education' },
  { value: 'real_estate', label: 'Real Estate' },
  { value: 'consulting', label: 'Consulting' },
  { value: 'automotive', label: 'Automotive' },
  { value: 'telecommunications', label: 'Telecommunications' },
  { value: 'other', label: 'Other' },
];

export const COMPANY_SIZES = [
  { value: '', label: 'Select Company Size' },
  { value: 'smb', label: 'SMB (1-50 employees)' },
  { value: 'mid_market', label: 'Mid-market (51-500 employees)' },
  { value: 'enterprise', label: 'Enterprise (500+ employees)' },
];

export const PRODUCT_INTERESTS = [
  { value: 'crm_software', label: 'CRM Software' },
  { value: 'erp_solution', label: 'ERP Solution' },
  { value: 'analytics_platform', label: 'Analytics Platform' },
  { value: 'automation_tools', label: 'Automation Tools' },
  { value: 'integration_services', label: 'Integration Services' },
  { value: 'consulting_services', label: 'Consulting Services' },
  { value: 'training_support', label: 'Training & Support' },
  { value: 'custom_development', label: 'Custom Development' },
];

export const PRIORITY_CONFIG = {
  low: { label: 'Low', color: '#6b7280', bgColor: '#f3f4f6' },
  medium: { label: 'Medium', color: '#d97706', bgColor: '#fef3c7' },
  high: { label: 'High', color: '#dc2626', bgColor: '#fee2e2' },
  critical: { label: 'Critical', color: '#7c2d12', bgColor: '#fed7aa' },
};

export const COMPANY_SIZE_CONFIG = {
  smb: { label: 'SMB', color: '#059669', bgColor: '#d1fae5' },
  mid_market: { label: 'Mid-market', color: '#0891b2', bgColor: '#cffafe' },
  enterprise: { label: 'Enterprise', color: '#7c3aed', bgColor: '#e9d5ff' },
};

// CRM Field Requirements by Status
export const STATUS_FIELD_REQUIREMENTS = {
  new: [],
  contacted: ['leadScore'],
  qualified: ['leadScore', 'minBudget', 'maxBudget', 'industry', 'productInterests'],
  unqualified: [],
  converted: ['leadScore', 'minBudget', 'maxBudget', 'priority', 'expectedClosureDate', 'industry', 'companySize', 'productInterests'],
};

// Conversion Requirements
export const CONVERSION_REQUIREMENTS = {
  mandatoryFields: ['leadScore', 'minBudget', 'maxBudget', 'priority', 'expectedClosureDate', 'industry', 'companySize', 'productInterests'],
  minimumScore: LEAD_SCORE_THRESHOLDS.CONVERSION_MIN,
  validStatuses: ['qualified'],
};

// Account & Deal Integration Placeholders
export const LINKED_ENTITY_TYPES = {
  ACCOUNT: 'account',
  DEAL: 'deal',
};

export const CONVERSION_ACTIONS = [
  { value: 'create_account', label: 'Create Account', description: 'Create new company account' },
  { value: 'create_deal', label: 'Create Deal', description: 'Create sales opportunity' },
  { value: 'link_existing', label: 'Link to Existing', description: 'Link to existing account/deal' },
];