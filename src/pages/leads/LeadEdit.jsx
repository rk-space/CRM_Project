import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import LeadForm from '../../components/leads/LeadForm';
import { leadsService } from '../../services/leadsService';

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
    try {
      await leadsService.updateLead(id, formData);
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

// Mock data
const getMockLead = (id) => ({
  id,
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phone: '+1234567890',
  company: 'Acme Corp',
  jobTitle: 'CEO',
  status: 'new',
  source: 'website',
  ownerId: '1',
});

export default LeadEdit;
