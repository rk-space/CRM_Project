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
          <div style={{ backgroundColor: '#f9fafb', padding: '12px', borderRadius: '6px', border: '1px solid #e5e7eb' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <strong style={{ fontSize: '14px' }}>{event.title}</strong>
              <span style={{ fontSize: '12px', color: '#6b7280' }}>
                {new Date(event.timestamp).toLocaleString()}
              </span>
            </div>
            <p style={{ margin: '4px 0', fontSize: '13px', color: '#374151' }}>{event.description}</p>
            {event.user && (
              <span style={{ fontSize: '12px', color: '#6b7280' }}>by {event.user}</span>
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
  };
  return colors[type] || '#6b7280';
};

export default Timeline;
