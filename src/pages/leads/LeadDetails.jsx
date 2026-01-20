import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Timeline from '../../components/leads/Timeline';
import LeadOverview from '../../components/leads/LeadOverview';
import { usePermissions } from '../../hooks/usePermissions';
import { leadsService } from '../../services/leadsService';
import { validateStatusTransition, validateConversion } from '../../utils/leadRules';
import { LEAD_STATUSES } from '../../utils/constants';
import { CONVERSION_ACTIONS } from '../../utils/leadConstants';
import Modal from '../../components/modal/Modal';

const LeadDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { hasPermission } = usePermissions();
  const [lead, setLead] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState('');
  const [statusChangeErrors, setStatusChangeErrors] = useState([]);
  const [showConversionModal, setShowConversionModal] = useState(false);
  const [conversionErrors, setConversionErrors] = useState([]);
  const [conversionStep, setConversionStep] = useState('validation'); // 'validation' | 'actions'
  const [networkError, setNetworkError] = useState(null);
  const [permissionError, setPermissionError] = useState(null);

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
    // Validate status transition
    const validation = validateStatusTransition(lead.status, newStatus, lead);
    
    if (!validation.isValid) {
      setStatusChangeErrors(validation.errors);
      return;
    }

    // Clear any previous errors
    setStatusChangeErrors([]);

    try {
      await leadsService.changeStatus(id, newStatus);
      
      // Log status change event
      await leadsService.addTimelineEvent(id, {
        type: 'status_change',
        title: 'Status Changed',
        description: `Status changed from ${lead.status} to ${newStatus}`,
        metadata: { fromStatus: lead.status, toStatus: newStatus }
      });
      
      fetchLead();
      fetchTimeline();
    } catch (err) {
      console.error(err);
    }
  };

  const handleConversionAttempt = () => {
    const validation = validateConversion(lead);
    
    if (!validation.canConvert) {
      setConversionErrors(validation.errors);
      setConversionStep('validation');
      setShowConversionModal(true);
      return;
    }
    
    // If validation passes, show conversion actions
    setConversionStep('actions');
    setShowConversionModal(true);
  };

  const handleConversion = async (action) => {
    try {
      // Log conversion attempt
      await leadsService.addTimelineEvent(id, {
        type: 'conversion_success',
        title: 'Lead Converted',
        description: `Lead successfully converted with action: ${action}`,
        metadata: { conversionAction: action }
      });
      
      // Change status to converted
      await handleStatusChange('converted');
      
      setShowConversionModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleConversionModalClose = () => {
    setShowConversionModal(false);
    setConversionErrors([]);
    setConversionStep('validation');
  };

  if (loading || !lead) {
    return <p>Loading lead details...</p>;
  }

  const isConverted = lead?.status === 'converted';
  const canEdit = hasPermission('leads.edit') && !isConverted;
  const canChangeStatus = hasPermission('leads.changeStatus') && !isConverted;

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
          <button
            onClick={() => navigate(`/leads/${id}/edit`)}
            disabled={!canEdit}
            style={{ 
              padding: '8px 16px', 
              cursor: canEdit ? 'pointer' : 'not-allowed',
              backgroundColor: canEdit ? '#0066cc' : '#e5e7eb',
              color: canEdit ? '#fff' : '#9ca3af',
              border: 'none',
              borderRadius: '4px',
              opacity: canEdit ? 1 : 0.6
            }}
            title={!canEdit ? (isConverted ? 'Cannot edit converted leads' : 'No edit permission') : ''}
          >
            Edit Lead
          </button>
          
          <select
            value={lead.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            disabled={!canChangeStatus}
            style={{ 
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              backgroundColor: canChangeStatus ? '#fff' : '#f3f4f6',
              color: canChangeStatus ? '#000' : '#9ca3af',
              cursor: canChangeStatus ? 'pointer' : 'not-allowed'
            }}
            title={!canChangeStatus ? (isConverted ? 'Cannot change status of converted leads' : 'No status change permission') : ''}
          >
            {LEAD_STATUSES.map(status => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>

          {lead.status === 'qualified' && !isConverted && (
            <button
              onClick={handleConversionAttempt}
              disabled={!canChangeStatus}
              style={{
                padding: '8px 16px',
                backgroundColor: canChangeStatus ? '#10b981' : '#e5e7eb',
                color: canChangeStatus ? '#fff' : '#9ca3af',
                border: 'none',
                borderRadius: '4px',
                cursor: canChangeStatus ? 'pointer' : 'not-allowed',
                fontWeight: '500'
              }}
              title={!canChangeStatus ? 'No conversion permission' : ''}
            >
              Convert Lead
            </button>
          )}
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

      {/* Status Change Errors */}
      {statusChangeErrors.length > 0 && (
        <div style={{ 
          marginBottom: '16px', 
          padding: '12px', 
          backgroundColor: '#fee2e2', 
          border: '1px solid #fecaca',
          borderRadius: '6px'
        }}>
          <h4 style={{ margin: '0 0 8px 0', color: '#991b1b' }}>Status Change Blocked:</h4>
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            {statusChangeErrors.map((error, index) => (
              <li key={index} style={{ color: '#991b1b', fontSize: '14px' }}>{error}</li>
            ))}
          </ul>
          <button
            onClick={() => setStatusChangeErrors([])}
            style={{
              marginTop: '8px',
              padding: '4px 8px',
              fontSize: '12px',
              backgroundColor: '#991b1b',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Tab Content */}
      {activeTab === 'overview' && <LeadOverview lead={lead} />}

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

      {/* Enhanced Conversion Modal */}
      {showConversionModal && (
        <Modal onClose={handleConversionModalClose}>
          <div style={{ padding: '24px', maxWidth: '600px' }}>
            {conversionStep === 'validation' ? (
              // Validation Error Step
              <>
                <h3 style={{ margin: '0 0 16px 0', color: '#991b1b' }}>Conversion Blocked</h3>
                <p style={{ marginBottom: '16px', color: '#374151' }}>
                  This lead cannot be converted due to the following issues:
                </p>
                <ul style={{ marginBottom: '20px', paddingLeft: '20px' }}>
                  {conversionErrors.map((error, index) => (
                    <li key={index} style={{ color: '#991b1b', marginBottom: '4px' }}>{error}</li>
                  ))}
                </ul>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => navigate(`/leads/${id}/edit`)}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#0066cc',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Edit Lead
                  </button>
                  <button
                    onClick={handleConversionModalClose}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#6b7280',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Close
                  </button>
                </div>
              </>
            ) : (
              // Conversion Actions Step
              <>
                <h3 style={{ margin: '0 0 16px 0', color: '#059669' }}>Convert Lead</h3>
                <p style={{ marginBottom: '20px', color: '#374151' }}>
                  Lead is ready for conversion. Choose the next action:
                </p>
                <div style={{ marginBottom: '24px' }}>
                  {CONVERSION_ACTIONS.map(action => (
                    <div key={action.value} style={{
                      padding: '16px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      marginBottom: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onClick={() => handleConversion(action.value)}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#f9fafb'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                    >
                      <div style={{ fontWeight: '600', marginBottom: '4px' }}>{action.label}</div>
                      <div style={{ fontSize: '14px', color: '#6b7280' }}>{action.description}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                  <button
                    onClick={handleConversionModalClose}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#6b7280',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};



// Mock data with advanced CRM fields
const getMockLead = (id) => ({
  id,
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phone: '+1234567890',
  company: 'Acme Corp',
  jobTitle: 'CEO',
  status: 'qualified',
  source: 'website',
  owner: 'Sarah Smith',
  manualLeadScore: 80,
  leadScore: 75,
  minBudget: '2500000',
  maxBudget: '5000000',
  priority: 'high',
  industry: 'technology',
  companySize: 'enterprise',
  expectedClosureDate: '2024-03-15',
  productInterests: ['crm_software', 'analytics_platform'],
  createdAt: '2024-01-15T10:30:00Z',
  updatedAt: '2024-01-16T14:30:00Z',
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
    type: 'score_update',
    title: 'Lead Score Updated',
    description: 'Lead score automatically calculated: 45 points',
    timestamp: '2024-01-15T10:31:00Z',
    user: 'System',
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
    metadata: { fromStatus: 'new', toStatus: 'contacted' }
  },
  {
    type: 'updated',
    title: 'Lead Information Updated',
    description: 'Budget and industry information added',
    timestamp: '2024-01-16T11:30:00Z',
    user: 'Sarah Smith',
  },
  {
    type: 'score_update',
    title: 'Lead Score Updated',
    description: 'Lead score recalculated: 75 points (budget and industry added)',
    timestamp: '2024-01-16T11:31:00Z',
    user: 'System',
  },
  {
    type: 'status_change',
    title: 'Status Changed',
    description: 'Status changed from Contacted to Qualified',
    timestamp: '2024-01-17T14:45:00Z',
    user: 'Sarah Smith',
    metadata: { fromStatus: 'contacted', toStatus: 'qualified' }
  },
  {
    type: 'conversion_attempt',
    title: 'Conversion Attempt Failed',
    description: 'Attempted to convert lead but validation failed',
    timestamp: '2024-01-18T10:00:00Z',
    user: 'Sarah Smith',
    metadata: {
      errors: ['Expected closure date is required for conversion']
    }
  },
];

export default LeadDetails;
