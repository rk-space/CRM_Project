import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import LeadForm from '../../components/leads/LeadForm';
import { leadsService } from '../../services/leadsService';
import { validateLeadData } from '../../utils/leadValidators';

const LeadEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLead();
  }, [id]);

  const fetchLead = async () => {
    setLoading(true);
    try {
      const data = await leadsService.getLead(id).catch(() => getMockLead(id));
      setLead(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError(null);
    
    // Check if status is being changed
    const isStatusChange = lead && lead.status !== formData.status;
    
    // Validate with status change rules if applicable
    const validation = validateLeadData(formData, isStatusChange, formData.status);
    
    if (!validation.isValid) {
      setError('Please fix the validation errors before saving.');
      setLoading(false);
      return;
    }
    
    try {
      await leadsService.updateLead(id, formData);
      
      // Log status change if it occurred
      if (isStatusChange) {
        await leadsService.addTimelineEvent(id, {
          type: 'status_change',
          title: 'Status Changed',
          description: `Status changed from ${lead.status} to ${formData.status}`,
          metadata: { fromStatus: lead.status, toStatus: formData.status }
        });
      }
      
      navigate(`/leads/${id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(`/leads/${id}`);
  };

  if (loading && !lead) {
    return <p>Loading lead...</p>;
  }

  return (
    <div style={{ maxWidth: '900px' }}>
      <h1>Edit Lead</h1>
      
      {error && (
        <div style={{ padding: '12px', backgroundColor: '#fee', border: '1px solid #fcc', borderRadius: '4px', marginBottom: '16px' }}>
          Error: {error}
        </div>
      )}

      {lead && <LeadForm initialData={lead} onSubmit={handleSubmit} onCancel={handleCancel} isLoading={loading} />}
    </div>
  );
};

// Mock data with CRM fields
const getMockLead = (id) => ({
  id,
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phone: '+1234567890',
  company: 'Acme Corp',
  jobTitle: 'CEO',
  status: 'contacted',
  source: 'website',
  ownerId: '1',
  leadScore: 45,
  budget: '10000-50000',
  priority: 'medium',
  industry: 'technology',
  expectedClosureDate: '',
});

export default LeadEdit;
