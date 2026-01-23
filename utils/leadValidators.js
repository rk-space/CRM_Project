import { validateStatusTransition, validateConversion, calculateLeadScore } from './leadRules';

// Enhanced Lead Validation with CRM Rules
export const validateLeadData = (data, isStatusChange = false, newStatus = null) => {
  const errors = {};
  
  // Basic validation
  if (!data.firstName?.trim()) {
    errors.firstName = 'First name is required';
  }

  // Contact validation - either email OR phone required
  if (!data.email?.trim() && !data.phone?.trim()) {
    errors.contact = 'Either email or phone is required';
  }

  // Email format validation
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Invalid email format';
  }

  // Phone format validation
  if (data.phone && !/^[\+]?[\d\s\-\(\)]+$/.test(data.phone)) {
    errors.phone = 'Invalid phone format';
  }

  // CRM-specific validations
  if (data.leadScore !== undefined && data.leadScore !== '') {
    const score = parseInt(data.leadScore);
    if (isNaN(score) || score < 0 || score > 100) {
      errors.leadScore = 'Lead score must be between 0 and 100';
    }
  }

  if (data.expectedClosureDate) {
    const closureDate = new Date(data.expectedClosureDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (closureDate <= today) {
      errors.expectedClosureDate = 'Expected closure date must be in the future';
    }
  }

  // Status change validation
  if (isStatusChange && newStatus) {
    const statusValidation = validateStatusTransition(data.status, newStatus, data);
    if (!statusValidation.isValid) {
      errors.statusTransition = statusValidation.errors;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Conversion Validation
export const validateLeadConversion = (leadData) => {
  return validateConversion(leadData);
};

// Auto-calculate lead score when data changes
export const enhanceLeadData = (leadData) => {
  const enhanced = { ...leadData };
  
  // Auto-calculate lead score if not manually set
  if (!enhanced.leadScore || enhanced.leadScore === 0) {
    enhanced.leadScore = calculateLeadScore(leadData);
  }
  
  return enhanced;
};

// Field completion validation
export const getFieldCompletionStatus = (leadData) => {
  const coreFields = ['firstName', 'lastName', 'email', 'phone', 'company', 'jobTitle'];
  const crmFields = ['leadScore', 'budget', 'priority', 'industry', 'expectedClosureDate'];
  
  const coreCompletion = coreFields.filter(field => leadData[field] && leadData[field] !== '').length;
  const crmCompletion = crmFields.filter(field => leadData[field] && leadData[field] !== '').length;
  
  return {
    coreFields: {
      completed: coreCompletion,
      total: coreFields.length,
      percentage: Math.round((coreCompletion / coreFields.length) * 100)
    },
    crmFields: {
      completed: crmCompletion,
      total: crmFields.length,
      percentage: Math.round((crmCompletion / crmFields.length) * 100)
    },
    overall: {
      completed: coreCompletion + crmCompletion,
      total: coreFields.length + crmFields.length,
      percentage: Math.round(((coreCompletion + crmCompletion) / (coreFields.length + crmFields.length)) * 100)
    }
  };
};