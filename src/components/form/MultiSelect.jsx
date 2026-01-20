import React from 'react';

const MultiSelect = ({ label, options, value = [], onChange, error }) => {
  const handleToggle = (optionValue) => {
    const newValue = value.includes(optionValue)
      ? value.filter(v => v !== optionValue)
      : [...value, optionValue];
    onChange(newValue);
  };

  return (
    <div>
      <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>
        {label}
      </label>
      <div style={{
        border: '1px solid #d1d5db',
        borderRadius: '4px',
        padding: '8px',
        minHeight: '40px',
        backgroundColor: '#fff'
      }}>
        {options.map(option => (
          <label key={option.value} style={{
            display: 'inline-flex',
            alignItems: 'center',
            margin: '2px 8px 2px 0',
            cursor: 'pointer',
            fontSize: '14px'
          }}>
            <input
              type="checkbox"
              checked={value.includes(option.value)}
              onChange={() => handleToggle(option.value)}
              style={{ marginRight: '6px' }}
            />
            {option.label}
          </label>
        ))}
      </div>
      {error && <span style={{ color: 'red', fontSize: '12px' }}>{error}</span>}
    </div>
  );
};

export default MultiSelect;