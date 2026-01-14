import { useState, useEffect } from 'react';
import FormSection from '../form/FormSection';
import Input from '../form/Input';
import Select from '../form/Select';
import { validateLead, LEAD_STATUSES, LEAD_SOURCES } from '../../utils/validation';

const LeadForm = ({ initialData, onSubmit, onCancel, isLoading }) => {
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
    ...initialData,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({ ...formData, ...initialData });
    }
  }, [initialData]);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    // Clear error on change
    if (errors[field]) {
      setErrors({ ...errors, [field]: null });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validation = validateLead(formData);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    onSubmit(formData);
  };

  return (
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

      <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
        <button
          type="submit"
          disabled={isLoading}
          style={{
            padding: '10px 24px',
            backgroundColor: '#0066cc',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
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
  );
};

export default LeadForm;
