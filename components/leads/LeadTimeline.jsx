import { TIMELINE_EVENT_CONFIG } from '../../utils/constants';

const LeadTimeline = ({ events, onAddNote, canAddNote }) => {
  if (!events || events.length === 0) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '40px', 
        color: '#9ca3af',
        backgroundColor: '#f9fafb',
        borderRadius: '8px',
        border: '1px dashed #d1d5db'
      }}>
        <p style={{ margin: 0, fontSize: '14px' }}>No activity recorded yet</p>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', paddingLeft: '48px' }}>
      {events.map((event, index) => {
        const config = TIMELINE_EVENT_CONFIG[event.type] || TIMELINE_EVENT_CONFIG.default;
        
        return (
          <div key={index} style={{ marginBottom: '28px', position: 'relative' }}>
            {/* Timeline icon */}
            <div
              style={{
                position: 'absolute',
                left: '-36px',
                top: '4px',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                backgroundColor: config.bgColor,
                border: '3px solid #fff',
                boxShadow: '0 0 0 2px #e5e7eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                color: '#fff',
              }}
            >
              {config.icon}
            </div>
            
            {/* Timeline line */}
            {index < events.length - 1 && (
              <div
                style={{
                  position: 'absolute',
                  left: '-25px',
                  top: '28px',
                  width: '2px',
                  height: 'calc(100% + 4px)',
                  backgroundColor: '#e5e7eb',
                }}
              />
            )}

            {/* Event content */}
            <div style={{ 
              backgroundColor: '#fff', 
              padding: '16px', 
              borderRadius: '8px', 
              border: '1px solid #e5e7eb',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ 
                    fontSize: '12px', 
                    fontWeight: '600',
                    color: config.bgColor,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    {config.label}
                  </span>
                  <strong style={{ fontSize: '14px', color: '#111827' }}>{event.title}</strong>
                </div>
                <span style={{ fontSize: '12px', color: '#6b7280' }}>
                  {formatTimestamp(event.timestamp)}
                </span>
              </div>
              
              {event.description && (
                <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: '#4b5563', lineHeight: '1.5' }}>
                  {event.description}
                </p>
              )}
              
              {event.user && (
                <div style={{ marginTop: '8px', fontSize: '12px', color: '#6b7280' }}>
                  <span style={{ fontWeight: '500' }}>by</span> {event.user}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined 
  });
};

export default LeadTimeline;
