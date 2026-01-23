import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LeadForm from '../../components/leads/LeadForm';
import { leadsService } from '../../services/leadsService';
import { validateLeadData } from '../../utils/leadValidators';

const LeadCreate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError(null);
    
    // Validate lead data with CRM rules
    const validation = validateLeadData(formData);
    
    if (!validation.isValid) {
      setError('Please fix the validation errors before saving.');
      setLoading(false);
      return;
    }
    
    try {
      const newLead = await leadsService.createLead(formData);
      
      // Log creation event
      await leadsService.addTimelineEvent(newLead.id, {
        type: 'created',
        title: 'Lead Created',
        description: 'Lead was created in the system',
        metadata: { initialScore: formData.leadScore }
      });
      
      navigate('/leads');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/leads');
  };

  return (
    <div style={{ maxWidth: '900px' }}>
      <h1>Create New Lead</h1>
      
      {error && (
        <div style={{ padding: '12px', backgroundColor: '#fee', border: '1px solid #fcc', borderRadius: '4px', marginBottom: '16px' }}>
          Error: {error}
        </div>
      )}

      <LeadForm onSubmit={handleSubmit} onCancel={handleCancel} isLoading={loading} />
    </div>
  );
};

export default LeadCreate;
