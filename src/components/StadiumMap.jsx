import React from 'react';
import { Compass, Users, Clock, AlertTriangle, ShieldAlert } from 'lucide-react';

const SECTIONS = [
  { id: '101', d: "M 120,80 L 280,80 L 270,70 L 130,70 Z", origin: "200px 75px", title: "Section 101 - Inner North" },
  { id: '105', d: "M 120,220 L 280,220 L 270,230 L 130,230 Z", origin: "200px 225px", title: "Section 105 - Inner South" },
  { id: '107', d: "M 110,95 L 110,205 L 120,195 L 120,105 Z", origin: "115px 150px", title: "Section 107 - Inner West" },
  { id: '103', d: "M 290,95 L 290,205 L 280,195 L 280,105 Z", origin: "285px 150px", title: "Section 103 - Inner East" },
  
  // Corners Inner
  { id: '108', d: "M 120,80 L 120,105 L 110,95 Z", title: "Section 108 - Corner NW" },
  { id: '102', d: "M 280,80 L 280,105 L 290,95 Z", title: "Section 102 - Corner NE" },
  { id: '104', d: "M 280,220 L 280,195 L 290,205 Z", title: "Section 104 - Corner SE" },
  { id: '106', d: "M 120,220 L 120,195 L 110,205 Z", title: "Section 106 - Corner SW" },
  
  // Outer
  { id: '201', d: "M 100,50 L 300,50 L 280,65 L 120,65 Z", title: "Section 201 - Outer North" },
  { id: '205', d: "M 100,250 L 300,250 L 280,235 L 120,235 Z", title: "Section 205 - Outer South" },
  { id: '207', d: "M 90,75 L 90,225 L 105,210 L 105,90 Z", title: "Section 207 - Outer West" },
  { id: '203', d: "M 310,75 L 310,225 L 295,210 L 295,90 Z", title: "Section 203 - Outer East" },
  
  // VIP
  { id: 'VIP-A', d: "M 100,50 L 120,65 L 105,90 L 90,75 Z", title: "VIP Suite A" },
  { id: 'VIP-B', d: "M 300,50 L 280,65 L 295,90 L 310,75 Z", title: "VIP Suite B" },
  { id: 'VIP-C', d: "M 300,250 L 280,235 L 295,210 L 310,225 Z", title: "VIP Suite C" },
  { id: 'VIP-D', d: "M 100,250 L 120,235 L 105,210 L 90,225 Z", title: "VIP Suite D" }
];

export default function StadiumMap({ 
  selectedSection, 
  setSelectedSection, 
  stadiumData, 
  simulationMode 
}) {
  
  const handleSectionClick = (sectionId) => {
    setSelectedSection(sectionId);
  };

  const handleKeyDown = (e, sectionId) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleSectionClick(sectionId);
    }
  };

  const getHeatClass = (density) => {
    if (density < 50) return 'heat-low';
    if (density < 80) return 'heat-medium';
    return 'heat-high';
  };

  return (
    <div className="glass-card glow-indigo" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div className="card-title-bar">
        <h3><Compass size={18} style={{ color: 'var(--accent-cyber)' }} /> Interactive Arena Flow</h3>
        <span style={{ fontSize: '0.8rem', color: '#94a3b8', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '10px' }}>
          Interactive Map
        </span>
      </div>

      <div className="stadium-svg-container">
        <svg viewBox="0 0 400 300" width="100%" height="240" style={{ overflow: 'visible' }} aria-label="Interactive Stadium Map Grid">
          {/* Pitch / Field */}
          <rect x="130" y="90" width="140" height="120" rx="6" className="field-grass" aria-hidden="true" />
          {/* Field markings */}
          <rect x="130" y="90" width="140" height="120" rx="6" className="field-lines" aria-hidden="true" />
          <line x1="200" y1="90" x2="200" y2="210" className="field-lines" aria-hidden="true" />
          <circle cx="200" cy="150" r="25" className="field-lines" aria-hidden="true" />
          <rect x="130" y="125" width="20" height="50" className="field-lines" aria-hidden="true" />
          <rect x="250" y="125" width="20" height="50" className="field-lines" aria-hidden="true" />

          {/* Declaring Sector Paths */}
          {SECTIONS.map((sec) => {
            const data = stadiumData[sec.id] || { density: 0, gateWait: 0 };
            const heatClass = getHeatClass(data.density);
            const isSelected = selectedSection === sec.id;

            return (
              <path 
                key={sec.id}
                d={sec.d} 
                className={`stadium-sector ${heatClass}`}
                onClick={() => handleSectionClick(sec.id)}
                onKeyDown={(e) => handleKeyDown(e, sec.id)}
                role="button"
                tabIndex={0}
                aria-pressed={isSelected}
                aria-label={`${sec.title}. Current crowd density ${data.density} percent, entry gate wait time ${data.gateWait} minutes.`}
                style={{ 
                  transform: isSelected ? 'scale(1.03)' : 'none', 
                  transformOrigin: sec.origin || 'center',
                  outline: 'none'
                }}
              >
                <title>{sec.title}</title>
              </path>
            );
          })}

          {/* Exit Gates Visual Anchors */}
          <circle cx="200" cy="30" r="6" fill="#06b6d4" aria-hidden="true" />
          <text x="200" y="20" fill="#06b6d4" fontSize="8" fontWeight="bold" textAnchor="middle" aria-hidden="true">GATE A</text>
          
          <circle cx="365" cy="150" r="6" fill="#06b6d4" aria-hidden="true" />
          <text x="365" y="162" fill="#06b6d4" fontSize="8" fontWeight="bold" textAnchor="middle" aria-hidden="true">GATE B</text>

          <circle cx="200" cy="275" r="6" fill="#06b6d4" aria-hidden="true" />
          <text x="200" y="290" fill="#06b6d4" fontSize="8" fontWeight="bold" textAnchor="middle" aria-hidden="true">GATE C</text>

          <circle cx="35" cy="150" r="6" fill="#06b6d4" aria-hidden="true" />
          <text x="35" y="162" fill="#06b6d4" fontSize="8" fontWeight="bold" textAnchor="middle" aria-hidden="true">GATE D</text>
        </svg>
      </div>

      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', fontSize: '0.75rem' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ width: '10px', height: '10px', backgroundColor: 'rgba(16, 185, 129, 0.4)', border: '1px solid #10b981', borderRadius: '2px' }}></span>
          Low (&lt;50%)
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ width: '10px', height: '10px', backgroundColor: 'rgba(245, 158, 11, 0.4)', border: '1px solid #f59e0b', borderRadius: '2px' }}></span>
          Moderate (50-80%)
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ width: '10px', height: '10px', backgroundColor: 'rgba(239, 68, 68, 0.4)', border: '1px solid #ef4444', borderRadius: '2px' }}></span>
          High (&gt;80%)
        </span>
      </div>

      {selectedSection && stadiumData[selectedSection] ? (
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '10px', padding: '14px', marginTop: '4px' }}>
          <div className="flex-row-space-between" style={{ marginBottom: '8px' }}>
            <span style={{ fontSize: '0.95rem', fontWeight: '800', color: '#fff' }}>
              Section {selectedSection} ({stadiumData[selectedSection].name})
            </span>
            <span 
              style={{
                fontSize: '0.75rem',
                fontWeight: '700',
                padding: '2px 8px',
                borderRadius: '8px',
                backgroundColor: stadiumData[selectedSection].density > 80 
                  ? 'rgba(239, 68, 68, 0.15)' 
                  : stadiumData[selectedSection].density > 50 
                    ? 'rgba(245, 158, 11, 0.15)' 
                    : 'rgba(16, 185, 129, 0.15)',
                color: stadiumData[selectedSection].density > 80 
                  ? '#ef4444' 
                  : stadiumData[selectedSection].density > 50 
                    ? '#f59e0b' 
                    : '#10b981'
              }}
            >
              {stadiumData[selectedSection].density}% Density
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
            <div className="metric-row">
              <span className="metric-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Users size={12} /> Restroom Line:</span>
              <span className="metric-value">{stadiumData[selectedSection].restroomWait}m</span>
            </div>
            <div className="metric-row">
              <span className="metric-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={12} /> Food Line:</span>
              <span className="metric-value">{stadiumData[selectedSection].concessionWait}m</span>
            </div>
            <div className="metric-row" style={{ gridColumn: 'span 2' }}>
              <span className="metric-label">Primary Entry/Exit Gate:</span>
              <span className="metric-value">{stadiumData[selectedSection].exitGate} ({stadiumData[selectedSection].gateWait}m queue)</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', padding: '10px', backgroundColor: 'rgba(99, 102, 241, 0.05)', border: '1px solid rgba(99, 102, 241, 0.15)', borderRadius: '6px', fontSize: '0.8rem', color: '#cbd5e1' }}>
            <div style={{ marginTop: '2px' }}>
              {stadiumData[selectedSection].density > 80 ? (
                <ShieldAlert size={14} style={{ color: 'var(--accent-danger)' }} />
              ) : (
                <AlertTriangle size={14} style={{ color: 'var(--accent-cyber)' }} />
              )}
            </div>
            <div>
              <strong>AI Navigation Recommendation:</strong>
              <p style={{ marginTop: '2px', fontSize: '0.78rem', color: '#94a3b8' }}>
                {stadiumData[selectedSection].aiRecommendation}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center', color: '#64748b', fontSize: '0.8rem', padding: '24px 0', border: '1px dashed rgba(255,255,255,0.05)', borderRadius: '10px' }}>
          Select a sector on the map above to view AI real-time logistics analytics and optimal routing guide.
        </div>
      )}
    </div>
  );
}
