import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Timeline from '../../components/leads/Timeline';
import PermissionWrapper from '../../app/permissions/PermissionWrapper';
import { usePermissions } from '../../hooks/usePermissions';
import { leadsService } from '../../services/leadsService';

const LeadDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { hasPermission } = usePermissions();
  const [lead, setLead] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState('');

  useEffect(() => {
    fetchLead();
    fetchTimeline();
  }, [id]);

  const fetchLead = async () => {
    setLoading(true);
    try {
      const data = await leadsService.getLead(id).catch(() => getMockLead(id));
      setLead(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTimeline = async () => {
    try {
      const data = await leadsService.getLeadTimeline(id).catch(() => getMockTimeline());
      setTimeline(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddNote = async () => {
    if (!note.trim()) return;
    try {
      await leadsService.addNote(id, note);
      setNote('');
      fetchTimeline();
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await leadsService.changeStatus(id, newStatus);
      fetchLead();
      fetchTimeline();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading || !lead) {
    return <p>Loading lead details...</p>;
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <button onClick={() => navigate('/leads')} style={{ marginBottom: '8px', cursor: 'pointer' }}>
            ← Back to Leads
          </button>
          <h1 style={{ margin: 0 }}>
            {lead.firstName} {lead.lastName}
          </h1>
          <p style={{ margin: '4px 0', color: '#6b7280' }}>{lead.company}</p>
        </div>
        
        {/* Quick Actions */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <PermissionWrapper permission="leads.edit">
            <button
              onClick={() => navigate(`/leads/${id}/edit`)}
              style={{ padding: '8px 16px', cursor: 'pointer' }}
            >
              Edit Lead
            </button>
          </PermissionWrapper>
          <PermissionWrapper permission="leads.changeStatus">
            <select
              value={lead.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              style={{ padding: '8px' }}
            >
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="unqualified">Unqualified</option>
              <option value="converted">Converted</option>
            </select>
          </PermissionWrapper>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ borderBottom: '2px solid #e5e7eb', marginBottom: '24px' }}>
        <button
          onClick={() => setActiveTab('overview')}
          style={{
            padding: '12px 24px',
            border: 'none',
            backgroundColor: 'transparent',
            borderBottom: activeTab === 'overview' ? '2px solid #0066cc' : 'none',
            cursor: 'pointer',
            fontWeight: activeTab === 'overview' ? 'bold' : 'normal',
          }}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('timeline')}
          style={{
            padding: '12px 24px',
            border: 'none',
            backgroundColor: 'transparent',
            borderBottom: activeTab === 'timeline' ? '2px solid #0066cc' : 'none',
            cursor: 'pointer',
            fontWeight: activeTab === 'timeline' ? 'bold' : 'normal',
          }}
        >
          Timeline
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <InfoSection title="Contact Information">
            <InfoRow label="Email" value={lead.email || '-'} />
            <InfoRow label="Phone" value={lead.phone || '-'} />
            <InfoRow label="Company" value={lead.company || '-'} />
            <InfoRow label="Job Title" value={lead.jobTitle || '-'} />
          </InfoSection>

          <InfoSection title="Lead Information">
            <InfoRow label="Status" value={<StatusBadge status={lead.status} />} />
            <InfoRow label="Source" value={lead.source || '-'} />
            <InfoRow label="Owner" value={lead.owner || 'Unassigned'} />
            <InfoRow label="Created" value={new Date(lead.createdAt).toLocaleString()} />
          </InfoSection>
        </div>
      )}

      {activeTab === 'timeline' && (
        <div>
          {/* Add Note */}
          {hasPermission('leads.edit') && (
            <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: '#f9fafb', borderRadius: '6px' }}>
              <h3>Add Note</h3>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Enter your note..."
                style={{ width: '100%', padding: '8px', minHeight: '80px', marginBottom: '8px' }}
              />
              <button onClick={handleAddNote} style={{ padding: '8px 16px', cursor: 'pointer' }}>
                Add Note
              </button>
            </div>
          )}

          {/* Timeline */}
          <Timeline events={timeline} />
        </div>
      )}
    </div>
  );
};

// Helper Components
const InfoSection = ({ title, children }) => (
  <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '6px' }}>
    <h3 style={{ marginTop: 0 }}>{title}</h3>
    {children}
  </div>
);

const InfoRow = ({ label, value }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f3f4f6' }}>
    <span style={{ fontWeight: '500', color: '#6b7280' }}>{label}:</span>
    <span>{value}</span>
  </div>
);

const StatusBadge = ({ status }) => (
  <span
    style={{
      padding: '4px 12px',
      borderRadius: '12px',
      fontSize: '12px',
      backgroundColor: getStatusColor(status),
      color: '#fff',
    }}
  >
    {status}
  </span>
);

const getStatusColor = (status) => {
  const colors = {
    new: '#3b82f6',
    contacted: '#8b5cf6',
    qualified: '#10b981',
    unqualified: '#ef4444',
    converted: '#059669',
  };
  return colors[status] || '#6b7280';
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
  owner: 'Sarah Smith',
  createdAt: '2024-01-15T10:30:00Z',
});

const getMockTimeline = () => [
  {
    type: 'created',
    title: 'Lead Created',
    description: 'Lead was created in the system',
    timestamp: '2024-01-15T10:30:00Z',
    user: 'Sarah Smith',
  },
  {
    type: 'note',
    title: 'Note Added',
    description: 'Initial contact made via email. Interested in enterprise plan.',
    timestamp: '2024-01-15T14:20:00Z',
    user: 'Sarah Smith',
  },
  {
    type: 'status_change',
    title: 'Status Changed',
    description: 'Status changed from New to Contacted',
    timestamp: '2024-01-16T09:15:00Z',
    user: 'Sarah Smith',
  },
];

export default LeadDetails;
