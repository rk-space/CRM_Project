import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LeadForm from '../../components/leads/LeadForm';
import { leadsService } from '../../services/leadsService';

const LeadCreate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      await leadsService.createLead(formData);
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
