const Timeline = ({ events }) => {
  if (!events || events.length === 0) {
    return <p style={{ textAlign: 'center', padding: '20px', color: '#999' }}>No activity yet</p>;
  }

  return (
    <div style={{ position: 'relative', paddingLeft: '40px' }}>
      {events.map((event, index) => (
        <div key={index} style={{ marginBottom: '24px', position: 'relative' }}>
          {/* Timeline dot */}
          <div
            style={{
              position: 'absolute',
              left: '-28px',
              top: '4px',
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: getEventColor(event.type),
              border: '2px solid #fff',
              boxShadow: '0 0 0 2px #e5e7eb',
            }}
          />
          
          {/* Timeline line */}
          {index < events.length - 1 && (
            <div
              style={{
                position: 'absolute',
                left: '-23px',
                top: '16px',
                width: '2px',
                height: 'calc(100% + 8px)',
                backgroundColor: '#e5e7eb',
              }}
            />
          )}

          {/* Event content */}
          <div style={{ 
            backgroundColor: getEventBackgroundColor(event.type), 
            padding: '12px', 
            borderRadius: '6px', 
            border: `1px solid ${getEventBorderColor(event.type)}` 
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                  <strong style={{ fontSize: '14px' }}>{event.title}</strong>
                  {getEventIcon(event.type)}
                </div>
                {event.type === 'status_change' && event.metadata && (
                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
                    {event.metadata.fromStatus} → {event.metadata.toStatus}
                  </div>
                )}
              </div>
              <span style={{ fontSize: '12px', color: '#6b7280', whiteSpace: 'nowrap', marginLeft: '8px' }}>
                {new Date(event.timestamp).toLocaleString()}
              </span>
            </div>
            <p style={{ margin: '4px 0', fontSize: '13px', color: '#374151' }}>{event.description}</p>
            {event.user && (
              <span style={{ fontSize: '12px', color: '#6b7280' }}>by {event.user}</span>
            )}
            {event.type === 'conversion_attempt' && event.metadata?.errors && (
              <div style={{ marginTop: '8px', padding: '8px', backgroundColor: '#fee2e2', borderRadius: '4px' }}>
                <div style={{ fontSize: '12px', fontWeight: '500', color: '#991b1b', marginBottom: '4px' }}>Blocked by:</div>
                <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '12px', color: '#991b1b' }}>
                  {event.metadata.errors.map((error, i) => (
                    <li key={i}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

const getEventColor = (type) => {
  const colors = {
    note: '#3b82f6',
    status_change: '#8b5cf6',
    assignment: '#10b981',
    created: '#059669',
    updated: '#f59e0b',
    conversion_attempt: '#ef4444',
    conversion_success: '#10b981',
    score_update: '#0ea5e9',
  };
  return colors[type] || '#6b7280';
};

const getEventBackgroundColor = (type) => {
  const colors = {
    note: '#eff6ff',
    status_change: '#f3e8ff',
    assignment: '#ecfdf5',
    created: '#ecfdf5',
    updated: '#fffbeb',
    conversion_attempt: '#fef2f2',
    conversion_success: '#ecfdf5',
    score_update: '#f0f9ff',
  };
  return colors[type] || '#f9fafb';
};

const getEventBorderColor = (type) => {
  const colors = {
    note: '#dbeafe',
    status_change: '#e9d5ff',
    assignment: '#d1fae5',
    created: '#d1fae5',
    updated: '#fef3c7',
    conversion_attempt: '#fecaca',
    conversion_success: '#d1fae5',
    score_update: '#e0f2fe',
  };
  return colors[type] || '#e5e7eb';
};

const getEventIcon = (type) => {
  const iconStyle = { fontSize: '12px', opacity: 0.7 };
  
  switch (type) {
    case 'note':
      return <span style={iconStyle}>📝</span>;
    case 'status_change':
      return <span style={iconStyle}>🔄</span>;
    case 'assignment':
      return <span style={iconStyle}>👤</span>;
    case 'created':
      return <span style={iconStyle}>✨</span>;
    case 'updated':
      return <span style={iconStyle}>✏️</span>;
    case 'conversion_attempt':
      return <span style={iconStyle}>❌</span>;
    case 'conversion_success':
      return <span style={iconStyle}>🎉</span>;
    case 'score_update':
      return <span style={iconStyle}>📊</span>;
    default:
      return null;
  }
};

export default Timeline;
