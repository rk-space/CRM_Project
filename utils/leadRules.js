import { 
  STATUS_FIELD_REQUIREMENTS, 
  LEAD_SCORE_THRESHOLDS, 
  CONVERSION_REQUIREMENTS 
} from './leadConstants';

// Advanced Status Transition Rules
export const validateStatusTransition = (currentStatus, newStatus, leadData) => {
  const errors = [];
  const requirements = STATUS_FIELD_REQUIREMENTS[newStatus] || [];

  // Check required fields for new status
  requirements.forEach(field => {
    if (!leadData[field] || leadData[field] === '' || 
        (Array.isArray(leadData[field]) && leadData[field].length === 0)) {
      errors.push(`${getFieldLabel(field)} is required for ${newStatus} status`);
    }
  });

  // Advanced business rules
  switch (newStatus) {
    case 'qualified':
      if (leadData.leadScore < LEAD_SCORE_THRESHOLDS.QUALIFIED_MIN) {
        errors.push(`Lead score must be at least ${LEAD_SCORE_THRESHOLDS.QUALIFIED_MIN} to qualify`);
      }
      if (!leadData.minBudget || !leadData.maxBudget) {
        errors.push('Budget range (min and max) is required for qualified leads');
      }
      if (leadData.minBudget && leadData.maxBudget && parseInt(leadData.minBudget) >= parseInt(leadData.maxBudget)) {
        errors.push('Maximum budget must be greater than minimum budget');
      }
      if (!leadData.productInterests || leadData.productInterests.length === 0) {
        errors.push('At least one product/service interest must be selected');
      }
      break;

    case 'converted':
      if (currentStatus !== 'qualified') {
        errors.push('Lead must be qualified before conversion');
      }
      if (leadData.leadScore < LEAD_SCORE_THRESHOLDS.CONVERSION_MIN) {
        errors.push(`Lead score must be at least ${LEAD_SCORE_THRESHOLDS.CONVERSION_MIN} for conversion`);
      }
      if (!leadData.expectedClosureDate) {
        errors.push('Expected closure date is required for conversion');
      }
      if (!leadData.priority) {
        errors.push('Priority must be set before conversion');
      }
      if (!leadData.companySize) {
        errors.push('Company size must be specified for conversion');
      }
      // Validate closure date is in future
      if (leadData.expectedClosureDate) {
        const closureDate = new Date(leadData.expectedClosureDate);
        const today = new Date();
        if (closureDate <= today) {
          errors.push('Expected closure date must be in the future');
        }
      }
      break;

    case 'unqualified':
      // No restrictions for marking as unqualified
      break;
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Enhanced Conversion Validation
export const validateConversion = (leadData) => {
  const errors = [];
  const { mandatoryFields, minimumScore, validStatuses } = CONVERSION_REQUIREMENTS;

  // Check if current status allows conversion
  if (!validStatuses.includes(leadData.status)) {
    errors.push(`Lead must be in ${validStatuses.join(' or ')} status to convert`);
  }

  // Check mandatory fields
  mandatoryFields.forEach(field => {
    if (!leadData[field] || leadData[field] === '' || 
        (Array.isArray(leadData[field]) && leadData[field].length === 0)) {
      errors.push(`${getFieldLabel(field)} is required for conversion`);
    }
  });

  // Check minimum score
  if (leadData.leadScore < minimumScore) {
    errors.push(`Lead score must be at least ${minimumScore} for conversion`);
  }

  // Validate budget range
  if (leadData.minBudget && leadData.maxBudget) {
    if (parseInt(leadData.minBudget) >= parseInt(leadData.maxBudget)) {
      errors.push('Maximum budget must be greater than minimum budget');
    }
  }

  // Check expected closure date is in future
  if (leadData.expectedClosureDate) {
    const closureDate = new Date(leadData.expectedClosureDate);
    const today = new Date();
    if (closureDate <= today) {
      errors.push('Expected closure date must be in the future');
    }
  }

  return {
    canConvert: errors.length === 0,
    errors,
    missingFields: mandatoryFields.filter(field => 
      !leadData[field] || 
      (Array.isArray(leadData[field]) && leadData[field].length === 0)
    )
  };
};

// Advanced Lead Score Calculation
export const calculateLeadScore = (leadData) => {
  let score = 0;

  // Base contact information (30 points max)
  if (leadData.email) score += 10;
  if (leadData.phone) score += 10;
  if (leadData.company) score += 10;

  // Budget scoring (25 points max)
  if (leadData.minBudget && leadData.maxBudget) {
    const avgBudget = (parseInt(leadData.minBudget) + parseInt(leadData.maxBudget)) / 2;
    if (avgBudget >= 10000000) score += 25; // 1 crore+
    else if (avgBudget >= 5000000) score += 20; // 50 lakhs+
    else if (avgBudget >= 1000000) score += 15; // 10 lakhs+
    else if (avgBudget >= 500000) score += 10; // 5 lakhs+
    else score += 5;
  }

  // Company size scoring (15 points max)
  const companySizeScores = {
    enterprise: 15,
    mid_market: 10,
    smb: 5
  };
  score += companySizeScores[leadData.companySize] || 0;

  // Industry relevance (10 points max)
  const highValueIndustries = ['technology', 'finance', 'healthcare', 'manufacturing'];
  if (highValueIndustries.includes(leadData.industry)) score += 10;
  else if (leadData.industry) score += 5;

  // Product interest depth (10 points max)
  if (leadData.productInterests && leadData.productInterests.length > 0) {
    score += Math.min(leadData.productInterests.length * 2, 10);
  }

  // Priority boost (10 points max)
  const priorityScores = {
    critical: 10,
    high: 7,
    medium: 4,
    low: 1
  };
  score += priorityScores[leadData.priority] || 0;

  return Math.min(score, 100); // Cap at 100
};

// System Score vs Manual Score Logic
export const getScoreRecommendation = (leadData) => {
  const systemScore = calculateLeadScore(leadData);
  const manualScore = leadData.manualLeadScore || 0;
  
  if (Math.abs(systemScore - manualScore) > 20) {
    return {
      hasDiscrepancy: true,
      systemScore,
      manualScore,
      recommendation: systemScore > manualScore ? 
        'Consider increasing manual score based on system calculation' :
        'Manual score is significantly higher than system calculation'
    };
  }
  
  return { hasDiscrepancy: false, systemScore, manualScore };
};

// Utility Functions
const getFieldLabel = (field) => {
  const labels = {
    leadScore: 'Lead Score',
    manualLeadScore: 'Manual Lead Score',
    minBudget: 'Minimum Budget',
    maxBudget: 'Maximum Budget',
    priority: 'Priority',
    industry: 'Industry',
    companySize: 'Company Size',
    expectedClosureDate: 'Expected Closure Date',
    productInterests: 'Product/Service Interests'
  };
  return labels[field] || field;
};

// Priority-based Lead Scoring
export const getPriorityFromScore = (score) => {
  if (score >= 90) return 'critical';
  if (score >= LEAD_SCORE_THRESHOLDS.HIGH_PRIORITY_MIN) return 'high';
  if (score >= LEAD_SCORE_THRESHOLDS.QUALIFIED_MIN) return 'medium';
  return 'low';
};

// Next Best Action Suggestions
export const getNextBestAction = (leadData) => {
  const score = leadData.leadScore || 0;
  const status = leadData.status;

  if (status === 'new' && score < 30) {
    return 'Gather more lead information to improve score';
  }
  
  if (status === 'contacted' && score >= LEAD_SCORE_THRESHOLDS.QUALIFIED_MIN) {
    return 'Lead is ready for qualification - update budget and product interests';
  }
  
  if (status === 'qualified' && score >= LEAD_SCORE_THRESHOLDS.CONVERSION_MIN) {
    return 'Lead is ready for conversion - set priority and closure date';
  }
  
  if (!leadData.minBudget || !leadData.maxBudget) {
    return 'Define budget range to improve lead qualification';
  }
  
  if (!leadData.productInterests || leadData.productInterests.length === 0) {
    return 'Identify product/service interests for better targeting';
  }
  
  if (!leadData.companySize) {
    return 'Determine company size for accurate lead scoring';
  }
  
  return 'Continue nurturing this lead with targeted content';
};