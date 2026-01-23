import { useState, useEffect } from 'react';
import FormSection from '../form/FormSection';
import Input from '../form/Input';
import Select from '../form/Select';
import MultiSelect from '../form/MultiSelect';
import { validateLeadData, enhanceLeadData } from '../../utils/leadValidators';
import { LEAD_STATUSES, LEAD_SOURCES } from '../../utils/constants';
import { 
  BUDGET_RANGES, 
  PRIORITY_LEVELS, 
  INDUSTRIES, 
  COMPANY_SIZES, 
  PRODUCT_INTERESTS 
} from '../../utils/leadConstants';
import { calculateLeadScore, getScoreRecommendation } from '../../utils/leadRules';
import { ErrorBoundary } from '../common';

const LeadForm = ({ initialData, onSubmit, onCancel, isLoading }) => {
  const isConverted = initialData?.status === 'converted';
  const isReadOnly = isConverted;
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    jobTitle: '',
    status: 'new',
    source: '',
    ownerId: '',
    notes: '',
    // Advanced CRM Fields
    manualLeadScore: 0,
    leadScore: 0, // System calculated
    minBudget: '',
    maxBudget: '',
    priority: '',
    industry: '',
    companySize: '',
    expectedClosureDate: '',
    productInterests: [],
    ...initialData,
  });

  const [errors, setErrors] = useState({});
  const [autoCalculateScore, setAutoCalculateScore] = useState(!initialData?.manualLeadScore);
  const [scoreRecommendation, setScoreRecommendation] = useState(null);

  useEffect(() => {
    if (initialData) {
      setFormData({ ...formData, ...initialData });
      setAutoCalculateScore(!initialData.manualLeadScore || initialData.manualLeadScore === 0);
    }
  }, [initialData]);

  // Auto-calculate system score and compare with manual score
  useEffect(() => {
    const systemScore = calculateLeadScore(formData);
    setFormData(prev => ({ ...prev, leadScore: systemScore }));
    
    if (formData.manualLeadScore > 0) {
      const recommendation = getScoreRecommendation({
        ...formData,
        leadScore: systemScore
      });
      setScoreRecommendation(recommendation);
    }
  }, [formData.minBudget, formData.maxBudget, formData.industry, formData.companySize, 
      formData.priority, formData.productInterests, formData.source, formData.company, 
      formData.email, formData.phone, formData.manualLeadScore]);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    
    // Clear error on change
    if (errors[field]) {
      setErrors({ ...errors, [field]: null });
    }

    // If manually changing lead score, disable auto-calculation
    if (field === 'manualLeadScore') {
      setAutoCalculateScore(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isReadOnly) {
      return; // Prevent submission for converted leads
    }
    
    const enhancedData = enhanceLeadData(formData);
    const validation = validateLeadData(enhancedData);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    onSubmit(enhancedData);
  };

  const resetAutoCalculation = () => {
    setAutoCalculateScore(true);
    const calculatedScore = calculateLeadScore(formData);
    setFormData(prev => ({ ...prev, leadScore: calculatedScore, manualLeadScore: 0 }));
    setScoreRecommendation(null);
  };

  return (
    <div>
      {/* Converted Lead Warning */}
      {isConverted && (
        <ErrorBoundary 
          message="This lead has been converted and is now read-only. Changes cannot be made to converted leads."
          type="general"
          showRetry={false}
        />
      )}
      
      <form onSubmit={handleSubmit}>
      <FormSection title="Basic Information">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <Input
              label="First Name *"
              value={formData.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
            />
            {errors.firstName && <span style={{ color: 'red', fontSize: '12px' }}>{errors.firstName}</span>}
          </div>
          <Input
            label="Last Name"
            value={formData.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
          />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <Input
            label="Company"
            value={formData.company}
            onChange={(e) => handleChange('company', e.target.value)}
          />
          <Input
            label="Job Title"
            value={formData.jobTitle}
            onChange={(e) => handleChange('jobTitle', e.target.value)}
          />
        </div>
      </FormSection>

      <FormSection title="Contact Details">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
            />
            {errors.email && <span style={{ color: 'red', fontSize: '12px' }}>{errors.email}</span>}
          </div>
          <div>
            <Input
              label="Phone"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
            />
            {errors.phone && <span style={{ color: 'red', fontSize: '12px' }}>{errors.phone}</span>}
          </div>
        </div>
        {errors.contact && <span style={{ color: 'red', fontSize: '12px' }}>{errors.contact}</span>}
      </FormSection>

      <FormSection title="Advanced CRM Scoring">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <label style={{ fontSize: '14px', fontWeight: '500' }}>Manual Lead Score</label>
              {!autoCalculateScore && (
                <button
                  type="button"
                  onClick={resetAutoCalculation}
                  style={{
                    fontSize: '12px',
                    color: '#0066cc',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                >
                  Use System Score
                </button>
              )}
            </div>
            <Input
              type="number"
              min="0"
              max="100"
              value={formData.manualLeadScore}
              onChange={(e) => handleChange('manualLeadScore', e.target.value)}
              placeholder="0-100"
            />
            {errors.manualLeadScore && <span style={{ color: 'red', fontSize: '12px' }}>{errors.manualLeadScore}</span>}
          </div>
          
          <div>
            <label style={{ fontSize: '14px', fontWeight: '500', display: 'block', marginBottom: '4px' }}>System Score (Read-only)</label>
            <div style={{
              padding: '8px 12px',
              border: '1px solid #e5e7eb',
              borderRadius: '4px',
              backgroundColor: '#f9fafb',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span style={{ fontWeight: '600', fontSize: '16px' }}>{formData.leadScore}</span>
              <div style={{
                flex: 1,
                height: '6px',
                backgroundColor: '#e5e7eb',
                borderRadius: '3px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${formData.leadScore}%`,
                  height: '100%',
                  backgroundColor: formData.leadScore >= 80 ? '#10b981' : 
                                  formData.leadScore >= 60 ? '#f59e0b' : '#ef4444'
                }} />
              </div>
            </div>
          </div>
        </div>
        
        {scoreRecommendation?.hasDiscrepancy && (
          <div style={{
            marginTop: '12px',
            padding: '12px',
            backgroundColor: '#fef3c7',
            border: '1px solid #f59e0b',
            borderRadius: '6px'
          }}>
            <div style={{ fontSize: '12px', fontWeight: '600', color: '#92400e', marginBottom: '4px' }}>SCORE RECOMMENDATION</div>
            <div style={{ fontSize: '14px', color: '#92400e' }}>{scoreRecommendation.recommendation}</div>
          </div>
        )}
      </FormSection>

      <FormSection title="Budget & Business Details">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <Input
            label="Minimum Budget (₹)"
            type="number"
            value={formData.minBudget}
            onChange={(e) => handleChange('minBudget', e.target.value)}
            placeholder="e.g., 500000"
          />
          <Input
            label="Maximum Budget (₹)"
            type="number"
            value={formData.maxBudget}
            onChange={(e) => handleChange('maxBudget', e.target.value)}
            placeholder="e.g., 2500000"
          />
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <Select
            label="Industry"
            options={INDUSTRIES}
            value={formData.industry}
            onChange={(e) => handleChange('industry', e.target.value)}
          />
          <Select
            label="Company Size"
            options={COMPANY_SIZES}
            value={formData.companySize}
            onChange={(e) => handleChange('companySize', e.target.value)}
          />
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <Select
            label="Priority"
            options={PRIORITY_LEVELS}
            value={formData.priority}
            onChange={(e) => handleChange('priority', e.target.value)}
          />
          <Input
            label="Expected Closure Date"
            type="date"
            value={formData.expectedClosureDate}
            onChange={(e) => handleChange('expectedClosureDate', e.target.value)}
          />
        </div>
        
        {errors.expectedClosureDate && <span style={{ color: 'red', fontSize: '12px' }}>{errors.expectedClosureDate}</span>}
      </FormSection>

      <FormSection title="Product/Service Interests">
        <MultiSelect
          label="Select Products/Services of Interest"
          options={PRODUCT_INTERESTS}
          value={formData.productInterests}
          onChange={(value) => handleChange('productInterests', value)}
          error={errors.productInterests}
        />
      </FormSection>

      <FormSection title="Lead Source & Status">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <Select
              label="Status *"
              options={LEAD_STATUSES}
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value)}
            />
            {errors.status && <span style={{ color: 'red', fontSize: '12px' }}>{errors.status}</span>}
          </div>
          <Select
            label="Source"
            options={LEAD_SOURCES}
            value={formData.source}
            onChange={(e) => handleChange('source', e.target.value)}
          />
        </div>
      </FormSection>

      <FormSection title="Assignment">
        <Input
          label="Owner ID"
          value={formData.ownerId}
          onChange={(e) => handleChange('ownerId', e.target.value)}
          placeholder="Will be replaced with user dropdown"
        />
      </FormSection>

      {/* Status Transition Errors */}
      {errors.statusTransition && (
        <div style={{ 
          marginTop: '16px', 
          padding: '12px', 
          backgroundColor: '#fee2e2', 
          border: '1px solid #fecaca',
          borderRadius: '6px'
        }}>
          <h4 style={{ margin: '0 0 8px 0', color: '#991b1b' }}>Status Change Blocked:</h4>
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            {errors.statusTransition.map((error, index) => (
              <li key={index} style={{ color: '#991b1b', fontSize: '14px' }}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
        <button
          type="submit"
          disabled={isLoading || isReadOnly}
          style={{
            padding: '10px 24px',
            backgroundColor: (isLoading || isReadOnly) ? '#e5e7eb' : '#0066cc',
            color: (isLoading || isReadOnly) ? '#9ca3af' : '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: (isLoading || isReadOnly) ? 'not-allowed' : 'pointer',
          }}
        >
          {isLoading ? 'Saving...' : initialData?.id ? 'Update Lead' : 'Create Lead'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          style={{
            padding: '10px 24px',
            backgroundColor: '#6b7280',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Cancel
        </button>
      </div>
    </form>
    </div>
  );
};

export default LeadForm;
