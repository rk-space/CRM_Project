import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PRIORITY_CONFIG } from '../../utils/leadConstants';
import StatusBadge from '../common/StatusBadge';
import PriorityBadge from '../common/PriorityBadge';
import ScoreIndicator from '../common/ScoreIndicator';

const LeadsTable = ({ leads, onSort, sortConfig, onSelectionChange }) => {
  const [selectedIds, setSelectedIds] = useState([]);
  const navigate = useNavigate();

  const handleSelectAll = (e) => {
    const newSelection = e.target.checked ? leads.map((l) => l.id) : [];
    setSelectedIds(newSelection);
    onSelectionChange?.(newSelection);
  };

  const handleSelectRow = (id) => {
    const newSelection = selectedIds.includes(id)
      ? selectedIds.filter((i) => i !== id)
      : [...selectedIds, id];
    setSelectedIds(newSelection);
    onSelectionChange?.(newSelection);
  };

  const handleSort = (key) => {
    onSort?.(key);
  };

  const getSortIcon = (key) => {
    if (sortConfig?.key !== key) return '⇅';
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  if (!leads || leads.length === 0) {
    return <p style={{ textAlign: 'center', padding: '40px' }}>No leads found</p>;
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd' }}>
        <thead style={{ backgroundColor: '#f5f5f5' }}>
          <tr>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>
              <input type="checkbox" onChange={handleSelectAll} checked={selectedIds.length === leads.length} />
            </th>
            <th
              style={{ padding: '12px', textAlign: 'left', cursor: 'pointer', borderBottom: '2px solid #ddd' }}
              onClick={() => handleSort('name')}
            >
              Lead Name {getSortIcon('name')}
            </th>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Email</th>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Phone</th>
            <th
              style={{ padding: '12px', textAlign: 'left', cursor: 'pointer', borderBottom: '2px solid #ddd' }}
              onClick={() => handleSort('leadScore')}
            >
              Score {getSortIcon('leadScore')}
            </th>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Priority</th>
            <th
              style={{ padding: '12px', textAlign: 'left', cursor: 'pointer', borderBottom: '2px solid #ddd' }}
              onClick={() => handleSort('status')}
            >
              Status {getSortIcon('status')}
            </th>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Owner</th>
            <th
              style={{ padding: '12px', textAlign: 'left', cursor: 'pointer', borderBottom: '2px solid #ddd' }}
              onClick={() => handleSort('createdAt')}
            >
              Created {getSortIcon('createdAt')}
            </th>
            <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #ddd' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '12px' }}>
                <input
                  type="checkbox"
                  checked={selectedIds.includes(lead.id)}
                  onChange={() => handleSelectRow(lead.id)}
                />
              </td>
              <td
                style={{ padding: '12px', cursor: 'pointer', color: '#0066cc' }}
                onClick={() => navigate(`/leads/${lead.id}`)}
              >
                {lead.firstName} {lead.lastName}
              </td>
              <td style={{ padding: '12px' }}>{lead.email || '-'}</td>
              <td style={{ padding: '12px' }}>{lead.phone || '-'}</td>
              <td style={{ padding: '12px', textAlign: 'center' }}>
                <ScoreIndicator 
                  score={lead.leadScore || 0}
                  leadData={lead}
                  showBreakdown={false}
                  size="small"
                />
              </td>
              <td style={{ padding: '12px' }}>
                <PriorityBadge priority={lead.priority} showIcon={true} size="small" />
              </td>
              <td style={{ padding: '12px' }}>
                <StatusBadge status={lead.status} priority={lead.priority} size="small" />
              </td>
              <td style={{ padding: '12px' }}>{lead.owner || 'Unassigned'}</td>
              <td style={{ padding: '12px' }}>{new Date(lead.createdAt).toLocaleDateString()}</td>
              <td style={{ padding: '12px', textAlign: 'center' }}>
                <button
                  onClick={() => navigate(`/leads/${lead.id}/edit`)}
                  style={{ marginRight: '8px', padding: '4px 8px', cursor: 'pointer' }}
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

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

export default LeadsTable;
