import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PermissionWrapper from '../../app/permissions/PermissionWrapper';
import { LEAD_STATUSES } from '../../utils/constants';
import { validateStatusTransition, validateConversion } from '../../utils/leadRules';

const LeadActions = ({ lead, onStatusChange, onAssign, onConvert }) => {
  const navigate = useNavigate();
  const [statusErrors, setStatusErrors] = useState([]);
  const [conversionErrors, setConversionErrors] = useState([]);
  const [showConversionModal, setShowConversionModal] = useState(false);

  const handleStatusChange = (newStatus) => {
    const validation = validateStatusTransition(lead.status, newStatus, lead);
    
    if (!validation.isValid) {
      setStatusErrors(validation.errors);
      return;
    }
    
    setStatusErrors([]);
    onStatusChange(newStatus);
  };

  const handleConvertClick = () => {
    const validation = validateConversion(lead);
    
    if (!validation.canConvert) {
      setConversionErrors(validation.errors);
      setShowConversionModal(true);
      return;
    }
    
    setConversionErrors([]);
    onConvert();
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <PermissionWrapper permission="leads.edit">
          <button
            onClick={() => navigate(`/leads/${lead.id}/edit`)}
            style={{
              padding: '8px 16px',
              backgroundColor: '#0066cc',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
            }}
          >
            Edit Lead
          </button>
        </PermissionWrapper>

        <PermissionWrapper permission="leads.changeStatus">
          <select
            value={lead.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            style={{
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px',
              cursor: 'pointer',
              backgroundColor: '#fff',
            }}
          >
            {LEAD_STATUSES.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </PermissionWrapper>

        <PermissionWrapper permission="leads.assign">
          <button
            onClick={onAssign}
            style={{
              padding: '8px 16px',
              backgroundColor: '#fff',
              color: '#374151',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
            }}
          >
            Assign Owner
          </button>
        </PermissionWrapper>

        <PermissionWrapper permission="leads.edit">
          <button
            onClick={handleConvertClick}
            style={{
              padding: '8px 16px',
              backgroundColor: '#10b981',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
            }}
          >
            Convert Lead
          </button>
        </PermissionWrapper>
      </div>

      {/* Status Change Errors */}
      {statusErrors.length > 0 && (
        <div style={{
          marginTop: '12px',
          padding: '12px',
          backgroundColor: '#fee2e2',
          border: '1px solid #fecaca',
          borderRadius: '6px'
        }}>
          <h4 style={{ margin: '0 0 8px 0', color: '#991b1b', fontSize: '14px' }}>Status Change Blocked:</h4>
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            {statusErrors.map((error, index) => (
              <li key={index} style={{ color: '#991b1b', fontSize: '13px' }}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Conversion Modal */}
      {showConversionModal && (
        <ConversionModal
          lead={lead}
          errors={conversionErrors}
          onClose={() => setShowConversionModal(false)}
          onProceed={onConvert}
        />
      )}
    </div>
  );
};

const ConversionModal = ({ lead, errors, onClose, onProceed }) => {
  const validation = validateConversion(lead);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: '#fff',
        padding: '24px',
        borderRadius: '8px',
        maxWidth: '500px',
        width: '90%',
        maxHeight: '80vh',
        overflow: 'auto'
      }}>
        <h3 style={{ margin: '0 0 16px 0', color: validation.canConvert ? '#059669' : '#dc2626' }}>
          {validation.canConvert ? 'Ready to Convert' : 'Conversion Blocked'}
        </h3>

        {!validation.canConvert && (
          <div>
            <p style={{ color: '#6b7280', marginBottom: '16px' }}>
              This lead cannot be converted yet. Please address the following issues:
            </p>
            <ul style={{ marginBottom: '20px', paddingLeft: '20px' }}>
              {errors.map((error, index) => (
                <li key={index} style={{ color: '#dc2626', marginBottom: '4px' }}>{error}</li>
              ))}
            </ul>

            {validation.missingFields.length > 0 && (
              <div style={{
                padding: '12px',
                backgroundColor: '#fef3c7',
                borderRadius: '6px',
                marginBottom: '16px'
              }}>
                <h4 style={{ margin: '0 0 8px 0', color: '#92400e', fontSize: '14px' }}>Missing Required Fields:</h4>
                <ul style={{ margin: 0, paddingLeft: '20px' }}>
                  {validation.missingFields.map((field, index) => (
                    <li key={index} style={{ color: '#92400e', fontSize: '13px' }}>
                      {getFieldLabel(field)}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {validation.canConvert && (
          <div>
            <p style={{ color: '#059669', marginBottom: '16px' }}>
              This lead meets all requirements for conversion. Proceed to convert to opportunity?
            </p>
            <div style={{
              padding: '12px',
              backgroundColor: '#d1fae5',
              borderRadius: '6px',
              marginBottom: '16px'
            }}>
              <h4 style={{ margin: '0 0 8px 0', color: '#065f46', fontSize: '14px' }}>Conversion Summary:</h4>
              <ul style={{ margin: 0, paddingLeft: '20px' }}>
                <li style={{ color: '#065f46', fontSize: '13px' }}>Lead Score: {lead.leadScore}</li>
                <li style={{ color: '#065f46', fontSize: '13px' }}>Budget: {lead.budget}</li>
                <li style={{ color: '#065f46', fontSize: '13px' }}>Priority: {lead.priority}</li>
                <li style={{ color: '#065f46', fontSize: '13px' }}>Expected Closure: {lead.expectedClosureDate}</li>
              </ul>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{
              padding: '8px 16px',
              backgroundColor: '#6b7280',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Close
          </button>
          {validation.canConvert && (
            <button
              onClick={() => {
                onProceed();
                onClose();
              }}
              style={{
                padding: '8px 16px',
                backgroundColor: '#10b981',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              Convert to Opportunity
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const getFieldLabel = (field) => {
  const labels = {
    leadScore: 'Lead Score',
    budget: 'Budget',
    priority: 'Priority',
    industry: 'Industry',
    expectedClosureDate: 'Expected Closure Date'
  };
  return labels[field] || field;
};

export default LeadActions;