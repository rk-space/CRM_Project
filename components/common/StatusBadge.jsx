import React from 'react';

const StatusBadge = ({ status, priority, showUrgency = true, size = 'normal' }) => {
  const getStatusConfig = () => {
    const configs = {
      new: { 
        label: 'New', 
        bgColor: '#dbeafe', 
        textColor: '#1e40af',
        urgencyColor: '#3b82f6'
      },
      contacted: { 
        label: 'Contacted', 
        bgColor: '#e0e7ff', 
        textColor: '#5b21b6',
        urgencyColor: '#8b5cf6'
      },
      qualified: { 
        label: 'Qualified', 
        bgColor: '#d1fae5', 
        textColor: '#065f46',
        urgencyColor: '#10b981'
      },
      unqualified: { 
        label: 'Unqualified', 
        bgColor: '#fee2e2', 
        textColor: '#991b1b',
        urgencyColor: '#ef4444'
      },
      converted: { 
        label: 'Converted', 
        bgColor: '#ecfdf5', 
        textColor: '#047857',
        urgencyColor: '#059669'
      },
    };
    return configs[status] || configs.new;
  };

  const getUrgencyIndicator = () => {
    if (!showUrgency || !priority) return null;
    
    const urgencyLevels = {
      critical: { 
        indicator: '🔥', 
        pulseColor: '#dc2626',
        description: 'Critical Priority'
      },
      high: { 
        indicator: '⚡', 
        pulseColor: '#ea580c',
        description: 'High Priority'
      },
      medium: { 
        indicator: '●', 
        pulseColor: '#d97706',
        description: 'Medium Priority'
      },
      low: { 
        indicator: '', 
        pulseColor: '',
        description: ''
      }
    };
    
    return urgencyLevels[priority] || null;
  };

  const getSizeStyles = () => {
    const sizes = {
      small: { padding: '2px 6px', fontSize: '10px' },
      normal: { padding: '4px 12px', fontSize: '12px' },
      large: { padding: '6px 16px', fontSize: '14px' }
    };
    return sizes[size] || sizes.normal;
  };

  const config = getStatusConfig();
  const urgency = getUrgencyIndicator();
  const sizeStyles = getSizeStyles();

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
      <span
        style={{
          ...sizeStyles,
          borderRadius: '12px',
          fontWeight: '500',
          backgroundColor: config.bgColor,
          color: config.textColor,
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px'
        }}
        title={urgency?.description}
      >
        {config.label}
        {urgency?.indicator && (
          <span 
            style={{ 
              fontSize: '10px',
              animation: priority === 'critical' ? 'pulse 2s infinite' : 'none'
            }}
          >
            {urgency.indicator}
          </span>
        )}
      </span>
      
      {/* Urgency pulse animation for critical items */}
      {priority === 'critical' && (
        <style>
          {`
            @keyframes pulse {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.5; }
            }
          `}
        </style>
      )}
    </div>
  );
};

export default StatusBadge;