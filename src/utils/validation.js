// Enterprise-grade validation (schema-ready for Zod integration)
export const validateLead = (data) => {
  const errors = {};

  // First Name is mandatory
  if (!data.firstName?.trim()) {
    errors.firstName = 'First name is required';
  }

  // Either email OR phone is required
  if (!data.email?.trim() && !data.phone?.trim()) {
    errors.contact = 'Either email or phone is required';
  }

  // Email format validation
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Invalid email format';
  }

  // Phone format validation (basic)
  if (data.phone && !/^\+?[\d\s-()]+$/.test(data.phone)) {
    errors.phone = 'Invalid phone format';
  }

  // Lead status is mandatory
  if (!data.status) {
    errors.status = 'Lead status is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const LEAD_STATUSES = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'qualified', label: 'Qualified' },
  { value: 'unqualified', label: 'Unqualified' },
  { value: 'converted', label: 'Converted' },
];

export const LEAD_SOURCES = [
  { value: 'website', label: 'Website' },
  { value: 'referral', label: 'Referral' },
  { value: 'social_media', label: 'Social Media' },
  { value: 'cold_call', label: 'Cold Call' },
  { value: 'event', label: 'Event' },
  { value: 'other', label: 'Other' },
];
