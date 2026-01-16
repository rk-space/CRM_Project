import { useNavigate } from 'react-router-dom';
import PermissionWrapper from '../../app/permissions/PermissionWrapper';
import { LEAD_STATUSES } from '../../utils/constants';

const LeadActions = ({ lead, onStatusChange, onAssign, onConvert }) => {
  const navigate = useNavigate();

  return (
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
          onChange={(e) => onStatusChange(e.target.value)}
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
          onClick={onConvert}
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
  );
};

export default LeadActions;
