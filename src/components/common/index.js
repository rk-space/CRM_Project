// Reusable CRM Components for Leads, Deals, Accounts, Contacts

export { default as ScoreIndicator } from './ScoreIndicator';
export { default as StatusBadge } from './StatusBadge';
export { default as PriorityBadge } from './PriorityBadge';
export { default as ErrorBoundary } from './ErrorBoundary';

// Usage Examples:
// import { ScoreIndicator, StatusBadge, PriorityBadge } from '../common';
// 
// <ScoreIndicator score={75} leadData={data} showBreakdown={true} />
// <StatusBadge status="qualified" priority="high" />
// <PriorityBadge priority="critical" showIcon={true} />
// <ErrorBoundary error={error} type="network" retry={retryFn} />