import React from 'react';

const PriorityBadge = ({ priority, showIcon = true, size = 'normal' }) => {
  const getPriorityConfig = () => {
    const configs = {
      critical: { 
        label: 'Critical', 
        color: '#7c2d12', 
        bgColor: '#fed7aa',
        borderColor: '#ea580c',
        icon: '🔥',
        pulse: true
      },
      high: { 
        label: 'High', 
        color: '#dc2626', 
        bgColor: '#fee2e2',
        borderColor: '#f87171',
        icon: '⚡',
        pulse: false
      },
      medium: { 
        label: 'Medium', 
        color: '#d97706', 
        bgColor: '#fef3c7',
        borderColor: '#fbbf24',
        icon: '●',
        pulse: false
      },
      low: { 
        label: 'Low', 
        color: '#6b7280', 
        bgColor: '#f3f4f6',
        borderColor: '#d1d5db',
        icon: '○',
        pulse: false
      },
    };
    return configs[priority] || configs.low;
  };

  const getSizeStyles = () => {
    const sizes = {
      small: { padding: '2px 6px', fontSize: '10px', borderWidth: '1px' },
      normal: { padding: '4px 8px', fontSize: '12px', borderWidth: '1px' },
      large: { padding: '6px 12px', fontSize: '14px', borderWidth: '2px' }
    };
    return sizes[size] || sizes.normal;
  };

  if (!priority) return null;

  const config = getPriorityConfig();
  const sizeStyles = getSizeStyles();

  return (
    <>
      <span
        style={{
          ...sizeStyles,
          borderRadius: '12px',
          fontWeight: '600',
          backgroundColor: config.bgColor,
          color: config.color,
          border: `${sizeStyles.borderWidth} solid ${config.borderColor}`,
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          animation: config.pulse ? 'priorityPulse 2s infinite' : 'none',
          boxShadow: priority === 'critical' ? '0 0 8px rgba(234, 88, 12, 0.3)' : 'none'
        }}
      >
        {showIcon && config.icon && (
          <span style={{ fontSize: '10px' }}>{config.icon}</span>
        )}
        {config.label}
      </span>
      
      {/* Priority pulse animation */}
      {config.pulse && (
        <style>
          {`
            @keyframes priorityPulse {
              0%, 100% { 
                transform: scale(1);
                box-shadow: 0 0 8px rgba(234, 88, 12, 0.3);
              }
              50% { 
                transform: scale(1.05);
                box-shadow: 0 0 12px rgba(234, 88, 12, 0.5);
              }
            }
          `}
        </style>
      )}
    </>
  );
};

export default PriorityBadge;