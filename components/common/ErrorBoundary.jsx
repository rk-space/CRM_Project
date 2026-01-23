import React from 'react';

const ErrorBoundary = ({ 
  error, 
  retry, 
  type = 'general', // 'permission' | 'network' | 'validation' | 'general'
  message,
  showRetry = true 
}) => {
  const getErrorConfig = () => {
    const configs = {
      permission: {
        icon: '🔒',
        title: 'Access Denied',
        defaultMessage: 'You do not have permission to perform this action.',
        bgColor: '#fef3c7',
        borderColor: '#f59e0b',
        textColor: '#92400e'
      },
      network: {
        icon: '🌐',
        title: 'Connection Error',
        defaultMessage: 'Unable to connect to server. Please check your connection.',
        bgColor: '#fee2e2',
        borderColor: '#ef4444',
        textColor: '#991b1b'
      },
      validation: {
        icon: '⚠️',
        title: 'Validation Error',
        defaultMessage: 'Please correct the highlighted fields and try again.',
        bgColor: '#fef3c7',
        borderColor: '#f59e0b',
        textColor: '#92400e'
      },
      general: {
        icon: '❌',
        title: 'Error',
        defaultMessage: 'Something went wrong. Please try again.',
        bgColor: '#fee2e2',
        borderColor: '#ef4444',
        textColor: '#991b1b'
      }
    };
    return configs[type] || configs.general;
  };

  if (!error && !message) return null;

  const config = getErrorConfig();
  const displayMessage = message || error?.message || config.defaultMessage;

  return (
    <div style={{
      padding: '12px 16px',
      backgroundColor: config.bgColor,
      border: `1px solid ${config.borderColor}`,
      borderRadius: '6px',
      margin: '8px 0',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px'
    }}>
      <span style={{ fontSize: '16px', flexShrink: 0 }}>{config.icon}</span>
      
      <div style={{ flex: 1 }}>
        <div style={{ 
          fontWeight: '600', 
          color: config.textColor, 
          fontSize: '14px',
          marginBottom: '4px'
        }}>
          {config.title}
        </div>
        
        <div style={{ 
          color: config.textColor, 
          fontSize: '13px',
          lineHeight: '1.4'
        }}>
          {displayMessage}
        </div>
        
        {type === 'permission' && (
          <div style={{ 
            fontSize: '12px', 
            color: config.textColor, 
            marginTop: '6px',
            opacity: 0.8
          }}>
            Contact your administrator to request access.
          </div>
        )}
      </div>
      
      {showRetry && retry && type !== 'permission' && (
        <button
          onClick={retry}
          style={{
            padding: '4px 8px',
            fontSize: '12px',
            backgroundColor: config.textColor,
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            flexShrink: 0
          }}
        >
          Retry
        </button>
      )}
    </div>
  );
};

export default ErrorBoundary;