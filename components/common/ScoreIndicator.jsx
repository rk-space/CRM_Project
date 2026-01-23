import React, { useState } from 'react';

const ScoreIndicator = ({ 
  score = 0, 
  manualScore = 0, 
  leadData = {}, 
  showBreakdown = true,
  size = 'normal' // 'small' | 'normal' | 'large'
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const getScoreBreakdown = () => {
    const factors = [];
    
    // Contact completeness
    if (leadData.email) factors.push({ label: 'Email provided', points: 10 });
    if (leadData.phone) factors.push({ label: 'Phone provided', points: 10 });
    if (leadData.company) factors.push({ label: 'Company information', points: 10 });
    
    // Budget scoring
    if (leadData.minBudget && leadData.maxBudget) {
      const avgBudget = (parseInt(leadData.minBudget) + parseInt(leadData.maxBudget)) / 2;
      if (avgBudget >= 10000000) factors.push({ label: 'High budget (₹1Cr+)', points: 25 });
      else if (avgBudget >= 5000000) factors.push({ label: 'Good budget (₹50L+)', points: 20 });
      else if (avgBudget >= 1000000) factors.push({ label: 'Medium budget (₹10L+)', points: 15 });
      else factors.push({ label: 'Budget defined', points: 10 });
    }
    
    // Company size
    if (leadData.companySize === 'enterprise') factors.push({ label: 'Enterprise client', points: 15 });
    else if (leadData.companySize === 'mid_market') factors.push({ label: 'Mid-market client', points: 10 });
    else if (leadData.companySize === 'smb') factors.push({ label: 'SMB client', points: 5 });
    
    // Industry relevance
    const highValueIndustries = ['technology', 'finance', 'healthcare', 'manufacturing'];
    if (highValueIndustries.includes(leadData.industry)) {
      factors.push({ label: 'High-value industry', points: 10 });
    } else if (leadData.industry) {
      factors.push({ label: 'Industry specified', points: 5 });
    }
    
    // Product interests
    if (leadData.productInterests && leadData.productInterests.length > 0) {
      factors.push({ 
        label: `${leadData.productInterests.length} product interest(s)`, 
        points: Math.min(leadData.productInterests.length * 2, 10) 
      });
    }
    
    // Priority
    const priorityPoints = { critical: 10, high: 7, medium: 4, low: 1 };
    if (leadData.priority && priorityPoints[leadData.priority]) {
      factors.push({ 
        label: `${leadData.priority} priority`, 
        points: priorityPoints[leadData.priority] 
      });
    }
    
    return factors;
  };

  const getSizeStyles = () => {
    const sizes = {
      small: { width: '40px', height: '4px', fontSize: '12px' },
      normal: { width: '60px', height: '6px', fontSize: '14px' },
      large: { width: '80px', height: '8px', fontSize: '16px' }
    };
    return sizes[size] || sizes.normal;
  };

  const sizeStyles = getSizeStyles();
  const breakdown = getScoreBreakdown();
  const totalCalculated = breakdown.reduce((sum, factor) => sum + factor.points, 0);

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <div 
        style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: showBreakdown ? 'pointer' : 'default' }}
        onMouseEnter={() => showBreakdown && setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <span style={{ fontWeight: '600', fontSize: sizeStyles.fontSize }}>{score}</span>
        <div style={{
          width: sizeStyles.width,
          height: sizeStyles.height,
          backgroundColor: '#e5e7eb',
          borderRadius: '3px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${Math.min(score, 100)}%`,
            height: '100%',
            backgroundColor: score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444',
            transition: 'width 0.3s ease'
          }} />
        </div>
        {showBreakdown && (
          <span style={{ fontSize: '12px', color: '#6b7280' }}>ⓘ</span>
        )}
      </div>

      {/* Score Breakdown Tooltip */}
      {showTooltip && showBreakdown && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: '0',
          zIndex: 1000,
          backgroundColor: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '12px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
          minWidth: '280px',
          marginTop: '4px'
        }}>
          <div style={{ fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
            Score Breakdown (System-Evaluated)
          </div>
          
          {breakdown.length > 0 ? (
            <>
              {breakdown.map((factor, index) => (
                <div key={index} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  fontSize: '12px',
                  marginBottom: '4px',
                  color: '#6b7280'
                }}>
                  <span>{factor.label}</span>
                  <span style={{ fontWeight: '500' }}>+{factor.points}</span>
                </div>
              ))}
              <div style={{ 
                borderTop: '1px solid #e5e7eb', 
                paddingTop: '6px', 
                marginTop: '6px',
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '12px',
                fontWeight: '600'
              }}>
                <span>System Total:</span>
                <span>{totalCalculated}</span>
              </div>
              {manualScore > 0 && manualScore !== score && (
                <div style={{ 
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '12px',
                  color: '#0066cc',
                  fontWeight: '500'
                }}>
                  <span>Manual Override:</span>
                  <span>{manualScore}</span>
                </div>
              )}
            </>
          ) : (
            <div style={{ fontSize: '12px', color: '#6b7280', fontStyle: 'italic' }}>
              Complete lead information to see score factors
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ScoreIndicator;