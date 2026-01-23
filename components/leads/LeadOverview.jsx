import { STATUS_CONFIG } from '../../utils/constants';
import { PRIORITY_CONFIG, COMPANY_SIZE_CONFIG, PRODUCT_INTERESTS } from '../../utils/leadConstants';
import { getNextBestAction } from '../../utils/leadRules';
import { getFieldCompletionStatus } from '../../utils/leadValidators';
import ScoreIndicator from '../common/ScoreIndicator';
import StatusBadge from '../common/StatusBadge';
import PriorityBadge from '../common/PriorityBadge';

const LeadOverview = ({ lead }) => {
  const completionStatus = getFieldCompletionStatus(lead);
  const nextAction = getNextBestAction(lead);
  const isConverted = lead.status === 'converted';

  return (
    <div>
      {/* Converted State Banner */}
      {isConverted && (
        <div style={{
          marginBottom: '24px',
          padding: '16px',
          backgroundColor: '#ecfdf5',
          border: '2px solid #10b981',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <span style={{ fontSize: '24px' }}>🎉</span>
          <div>
            <div style={{ fontWeight: '600', color: '#047857', fontSize: '16px' }}>Lead Converted Successfully</div>
            <div style={{ fontSize: '14px', color: '#065f46' }}>This lead has completed the sales cycle and is now read-only.</div>
          </div>
        </div>
      )}
      {/* Completion Progress */}
      <div style={{ 
        marginBottom: '24px', 
        padding: '16px', 
        backgroundColor: '#f8fafc', 
        borderRadius: '8px',
        border: '1px solid #e2e8f0'
      }}>
        <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600' }}>Lead Completion</h4>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontSize: '12px', color: '#64748b' }}>Overall Progress</span>
              <span style={{ fontSize: '12px', fontWeight: '500' }}>{completionStatus.overall.percentage}%</span>
            </div>
            <div style={{ 
              width: '100%', 
              height: '8px', 
              backgroundColor: '#e2e8f0', 
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${completionStatus.overall.percentage}%`,
                height: '100%',
                backgroundColor: completionStatus.overall.percentage >= 80 ? '#10b981' : 
                                completionStatus.overall.percentage >= 60 ? '#f59e0b' : '#ef4444',
                transition: 'width 0.3s ease'
              }} />
            </div>
          </div>
          <div style={{ fontSize: '12px', color: '#64748b' }}>
            {completionStatus.overall.completed}/{completionStatus.overall.total} fields
          </div>
        </div>
      </div>

      {/* Next Best Action */}
      {nextAction && (
        <div style={{ 
          marginBottom: '24px', 
          padding: '12px 16px', 
          backgroundColor: '#dbeafe', 
          borderRadius: '6px',
          borderLeft: '4px solid #3b82f6'
        }}>
          <div style={{ fontSize: '12px', fontWeight: '600', color: '#1e40af', marginBottom: '4px' }}>NEXT BEST ACTION</div>
          <div style={{ fontSize: '14px', color: '#1e40af' }}>{nextAction}</div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <InfoCard title="Lead Overview">
          <InfoRow label="Full Name" value={`${lead.firstName} ${lead.lastName}`} />
          <InfoRow label="Company" value={lead.company || '-'} />
          <InfoRow label="Job Title" value={lead.jobTitle || '-'} />
          <InfoRow label="Status" value={<StatusBadge status={lead.status} priority={lead.priority} />} />
          <InfoRow label="Owner" value={lead.owner || 'Unassigned'} />
        </InfoCard>

        <InfoCard title="Contact Information">
          <InfoRow label="Email" value={lead.email || '-'} />
          <InfoRow label="Phone" value={lead.phone || '-'} />
        </InfoCard>

        <InfoCard title="CRM Intelligence">
          <InfoRow label="Manual Score" value={
            <ScoreIndicator 
              score={lead.manualLeadScore || 0}
              leadData={lead}
              showBreakdown={false}
              size="normal"
            />
          } />
          <InfoRow label="System Score" value={
            <ScoreIndicator 
              score={lead.leadScore || 0}
              manualScore={lead.manualLeadScore || 0}
              leadData={lead}
              showBreakdown={true}
              size="normal"
            />
          } />
          <InfoRow label="Priority" value={
            <PriorityBadge priority={lead.priority} showIcon={true} />
          } />
          <InfoRow label="Budget Range" value={formatBudgetRange(lead.minBudget, lead.maxBudget)} />
          <InfoRow label="Industry" value={formatIndustry(lead.industry)} />
          <InfoRow label="Company Size" value={
            lead.companySize ? <CompanySizeBadge size={lead.companySize} /> : '-'
          } />
          <InfoRow label="Expected Closure" value={
            lead.expectedClosureDate ? new Date(lead.expectedClosureDate).toLocaleDateString() : '-'
          } />
        </InfoCard>

        <InfoCard title="Product Interests">
          {lead.productInterests && lead.productInterests.length > 0 ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {lead.productInterests.map(interest => {
                const product = PRODUCT_INTERESTS.find(p => p.value === interest);
                return (
                  <span key={interest} style={{
                    padding: '4px 8px',
                    backgroundColor: '#e0f2fe',
                    color: '#0891b2',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}>
                    {product?.label || interest}
                  </span>
                );
              })}
            </div>
          ) : (
            <div style={{ color: '#6b7280', fontStyle: 'italic' }}>No product interests specified</div>
          )}
        </InfoCard>
      </div>

      {/* Account & Deal Integration Placeholders */}
      <div style={{ marginTop: '24px' }}>
        <h4 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600', color: '#374151' }}>Linked Entities</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <InfoCard title="Account">
            {lead.linkedAccount ? (
              <div>
                <InfoRow label="Account Name" value={lead.linkedAccount.name} />
                <InfoRow label="Account Type" value={lead.linkedAccount.type} />
                <InfoRow label="Created" value={new Date(lead.linkedAccount.createdAt).toLocaleDateString()} />
              </div>
            ) : (
              <div style={{ 
                padding: '20px', 
                textAlign: 'center', 
                color: '#6b7280',
                border: '2px dashed #e5e7eb',
                borderRadius: '6px'
              }}>
                <div style={{ marginBottom: '8px' }}>No linked account</div>
                {isConverted ? (
                  <div style={{ fontSize: '12px', fontStyle: 'italic' }}>Account should be created post-conversion</div>
                ) : (
                  <button 
                    disabled
                    style={{
                      padding: '6px 12px',
                      fontSize: '12px',
                      backgroundColor: '#e5e7eb',
                      color: '#9ca3af',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'not-allowed'
                    }}
                    title="Available after conversion"
                  >
                    Create Account
                  </button>
                )}
              </div>
            )}
          </InfoCard>

          <InfoCard title="Deal">
            {lead.linkedDeal ? (
              <div>
                <InfoRow label="Deal Name" value={lead.linkedDeal.name} />
                <InfoRow label="Value" value={`₹${lead.linkedDeal.value?.toLocaleString('en-IN')}`} />
                <InfoRow label="Stage" value={lead.linkedDeal.stage} />
              </div>
            ) : (
              <div style={{ 
                padding: '20px', 
                textAlign: 'center', 
                color: '#6b7280',
                border: '2px dashed #e5e7eb',
                borderRadius: '6px'
              }}>
                <div style={{ marginBottom: '8px' }}>No linked deal</div>
                {isConverted ? (
                  <div style={{ fontSize: '12px', fontStyle: 'italic' }}>Deal should be created post-conversion</div>
                ) : (
                  <button 
                    disabled
                    style={{
                      padding: '6px 12px',
                      fontSize: '12px',
                      backgroundColor: '#e5e7eb',
                      color: '#9ca3af',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'not-allowed'
                    }}
                    title="Available after conversion"
                  >
                    Create Deal
                  </button>
                )}
              </div>
            )}
          </InfoCard>
        </div>

        <InfoCard title="Lead Meta">
          <InfoRow label="Source" value={lead.source || '-'} />
          <InfoRow label="Created At" value={new Date(lead.createdAt).toLocaleString()} />
          <InfoRow label="Last Updated" value={lead.updatedAt ? new Date(lead.updatedAt).toLocaleString() : '-'} />
        </InfoCard>
      </div>
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

const CompanySizeBadge = ({ size }) => {
  const config = COMPANY_SIZE_CONFIG[size] || COMPANY_SIZE_CONFIG.smb;
  
  return (
    <span style={{
      padding: '4px 12px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: '500',
      backgroundColor: config.bgColor,
      color: config.color,
    }}>
      {config.label}
    </span>
  );
};

const formatBudgetRange = (minBudget, maxBudget) => {
  if (!minBudget && !maxBudget) return '-';
  if (minBudget && maxBudget) {
    return `₹${parseInt(minBudget).toLocaleString('en-IN')} - ₹${parseInt(maxBudget).toLocaleString('en-IN')}`;
  }
  if (minBudget) return `₹${parseInt(minBudget).toLocaleString('en-IN')}+`;
  if (maxBudget) return `Up to ₹${parseInt(maxBudget).toLocaleString('en-IN')}`;
  return '-';
};

const formatIndustry = (industry) => {
  if (!industry) return '-';
  return industry.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
};

export default LeadOverview;
