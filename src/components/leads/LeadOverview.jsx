import { STATUS_CONFIG } from '../../utils/constants';

const LeadOverview = ({ lead }) => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
      <InfoCard title="Lead Overview">
        <InfoRow label="Full Name" value={`${lead.firstName} ${lead.lastName}`} />
        <InfoRow label="Company" value={lead.company || '-'} />
        <InfoRow label="Job Title" value={lead.jobTitle || '-'} />
        <InfoRow label="Status" value={<StatusBadge status={lead.status} />} />
        <InfoRow label="Owner" value={lead.owner || 'Unassigned'} />
      </InfoCard>

      <InfoCard title="Contact Information">
        <InfoRow label="Email" value={lead.email || '-'} />
        <InfoRow label="Phone" value={lead.phone || '-'} />
      </InfoCard>

      <InfoCard title="Business Details">
        <InfoRow label="Industry" value={lead.industry || '-'} />
        <InfoRow label="Expected Value" value={lead.expectedValue ? `$${lead.expectedValue}` : '-'} />
        <InfoRow label="Lead Score" value={lead.score || '-'} />
      </InfoCard>

      <InfoCard title="Lead Meta">
        <InfoRow label="Source" value={lead.source || '-'} />
        <InfoRow label="Created At" value={new Date(lead.createdAt).toLocaleString()} />
        <InfoRow label="Last Updated" value={lead.updatedAt ? new Date(lead.updatedAt).toLocaleString() : '-'} />
      </InfoCard>
    </div>
  );
};

const InfoCard = ({ title, children }) => (
  <div style={{ 
    padding: '20px', 
    border: '1px solid #e5e7eb', 
    borderRadius: '8px',
    backgroundColor: '#fff',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  }}>
    <h3 style={{ marginTop: 0, marginBottom: '16px', fontSize: '16px', fontWeight: '600' }}>{title}</h3>
    <div>{children}</div>
  </div>
);

const InfoRow = ({ label, value }) => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'space-between', 
    padding: '10px 0', 
    borderBottom: '1px solid #f3f4f6' 
  }}>
    <span style={{ fontWeight: '500', color: '#6b7280', fontSize: '14px' }}>{label}</span>
    <span style={{ fontSize: '14px', color: '#111827' }}>{value}</span>
  </div>
);

const StatusBadge = ({ status }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.new;
  
  return (
    <span style={{
      padding: '4px 12px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: '500',
      backgroundColor: config.bgColor,
      color: config.textColor,
    }}>
      {config.label}
    </span>
  );
};

export default LeadOverview;
