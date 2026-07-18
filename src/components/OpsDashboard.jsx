import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, Eye, Plus, Send, Zap, Droplets, Trash2, CheckCircle } from 'lucide-react';

export default function OpsDashboard({ 
  activeStadium, 
  activeAlerts, 
  setActiveAlerts, 
  onDispatchTask 
}) {
  const [incidentCategory, setIncidentCategory] = useState('Medical');
  const [incidentLocation, setIncidentLocation] = useState('Section 105');
  const [severity, setSeverity] = useState('Medium');
  const [description, setDescription] = useState('');
  
  // AI Incident planner result state
  const [aiPlan, setAiPlan] = useState(null);
  const [isPlanning, setIsPlanning] = useState(false);

  // Sustainability Toggles
  const [hvacOptimized, setHvacOptimized] = useState(false);
  const [waterOptimized, setWaterOptimized] = useState(false);
  const [recycleBoost, setRecycleBoost] = useState(false);

  // Handle live AI Alert recommendations
  const handleResolveAlert = (id) => {
    setActiveAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const handleGeneratePlan = (e) => {
    e.preventDefault();
    if (!description.trim()) return;

    setIsPlanning(true);
    
    // Simulate Gemini AI Incident Command Analysis
    setTimeout(() => {
      let priority = severity === 'High' ? 'CRITICAL - P1' : severity === 'Medium' ? 'HIGH - P2' : 'STANDARD - P3';
      let responseTeam = incidentCategory === 'Medical' ? 'Medical Response Team 2' 
                       : incidentCategory === 'Security' ? 'Security Detail A'
                       : incidentCategory === 'Crowd Control' ? 'Sectors 105-107 Volunteer Leads'
                       : 'Facility Maintenance Crew';
                       
      let actionSteps = [];
      let dispatchBroadcast = '';

      if (incidentCategory === 'Medical') {
        actionSteps = [
          `Deploy nearest medical bag & AED unit to Section ${incidentLocation}.`,
          `Instruct Volunteers in Sector ${incidentLocation} to clear path for paramedic entry.`,
          `Dispatch ${responseTeam} via service corridor B.`,
          `Broadcast alert to Sector Lead: "Monitor patient, maintain crowd perimeter."`
        ];
        dispatchBroadcast = `🚨 MEDICAL EMERGENCY SECTION ${incidentLocation}: Paramedics dispatched. Sector volunteers please secure perimeter and clear wheelchair lane.`;
      } else if (incidentCategory === 'Security') {
        actionSteps = [
          `Dispatch Security Detail to Section ${incidentLocation}.`,
          `Flag local CCTV camera #C-114 for live feed zoom.`,
          `Instruct volunteer guides to guide adjacent fans away from Section ${incidentLocation} corridors.`,
          `Log incident report to Local Police Command (FIFA Security Liaison).`
        ];
        dispatchBroadcast = `⚠️ SECURITY ALERT SECTION ${incidentLocation}: Officers responding. Volunteers please assist in keeping concourse corridors clear.`;
      } else if (incidentCategory === 'Crowd Control') {
        actionSteps = [
          `Divert Gate C entry flow to Gate B and D via exterior digital signboards.`,
          `Dispatch 4 volunteers to Concourse Section ${incidentLocation} to guide human lines.`,
          `Open auxiliary exit gate #C-4 for decompression.`,
          `AI prediction: Sector will clear in 8 minutes after sign update.`
        ];
        dispatchBroadcast = `📢 CROWD DENSITY WARNING SECTION ${incidentLocation}: Diverting ingress to Gate B. Volunteers in place to manage flow.`;
      } else {
        actionSteps = [
          `Log maintenance ticket. Issue: "${description}" at ${incidentLocation}.`,
          `Dispatch janitorial crew to clean and place dry-floor warning signs.`,
          `Check adjacent water shut-off valve if active leak.`,
          `Close Section corridor buffer zone temporarily if slip hazard is high.`
        ];
        dispatchBroadcast = `🔧 FACILITY BRIEF: Maintenance team dispatched to Section ${incidentLocation} to resolve facility issue. Volunteers watch for slip hazards.`;
      }

      setAiPlan({
        priority,
        category: incidentCategory,
        location: incidentLocation,
        team: responseTeam,
        steps: actionSteps,
        broadcast: dispatchBroadcast,
        rawDescription: description
      });

      setIsPlanning(false);
    }, 1200);
  };

  const handleApproveDispatch = () => {
    if (!aiPlan) return;
    
    // Send task to volunteers
    onDispatchTask({
      id: Date.now(),
      title: `${aiPlan.category} at ${aiPlan.location}`,
      description: aiPlan.steps[0],
      priority: severity === 'High' ? 'High' : 'Normal',
      stadium: activeStadium,
      status: 'pending',
      actionSteps: aiPlan.steps
    });

    // Add incident as warning in active alerts banner
    setActiveAlerts(prev => [
      {
        id: Date.now(),
        type: severity === 'High' ? 'danger' : 'warning',
        message: `Active ${aiPlan.category} Dispatch: ${aiPlan.location} - ${aiPlan.rawDescription.substring(0, 40)}...`,
        recommendation: `Follow AI Action steps: ${aiPlan.steps[1]}`
      },
      ...prev
    ]);

    alert('AI Incident Response Plan approved! Tasks successfully dispatched to all active volunteer handsets.');
    setAiPlan(null);
    setDescription('');
  };

  return (
    <div className="dashboard-grid">
      {/* LEFT COLUMN: Live AI Detections & Incident Commander */}
      <div className="flex-column-gap-16">
        {/* Live AI camera feeds */}
        <div className="glass-card glow-indigo">
          <div className="card-title-bar">
            <h3><Eye size={18} style={{ color: 'var(--accent-cyber)' }} /> Live AI Smart Camera Alerts</h3>
            <span style={{ fontSize: '0.75rem', color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '2px 8px', borderRadius: '10px', fontWeight: 'bold' }}>
              Simulated Feed Active
            </span>
          </div>

          <div className="feed-list">
            {activeAlerts.length > 0 ? (
              activeAlerts.map(alert => (
                <div 
                  key={alert.id} 
                  className={`feed-item ${alert.type === 'danger' ? 'alert-danger' : alert.type === 'warning' ? 'alert-warning' : 'alert-info'}`}
                >
                  <div style={{ marginTop: '2px' }}>
                    {alert.type === 'danger' ? (
                      <ShieldAlert size={16} style={{ color: 'var(--accent-danger)' }} />
                    ) : (
                      <AlertTriangle size={16} style={{ color: 'var(--accent-warning)' }} />
                    )}
                  </div>
                  <div className="feed-content" style={{ flex: 1 }}>
                    <div className="flex-row-space-between">
                      <h5>{alert.message}</h5>
                      <span className="feed-time">Just Now</span>
                    </div>
                    <p style={{ marginTop: '4px', fontSize: '0.8rem', color: '#cbd5e1' }}>
                      <strong>AI Recommendation:</strong> {alert.recommendation}
                    </p>
                    <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
                      <button 
                        onClick={() => handleResolveAlert(alert.id)}
                        className="btn-secondary" 
                        style={{ padding: '4px 10px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        <CheckCircle size={12} style={{ color: 'var(--accent-fifa)' }} /> Resolve & Dismiss
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', color: '#64748b', fontSize: '0.8rem', padding: '20px', border: '1px dashed rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                ✅ All systems normal. AI computer vision models reporting no crowd overflows or security anomalies.
              </div>
            )}
          </div>
        </div>

        {/* Incident Commander Panel */}
        <div className="glass-card glow-indigo">
          <div className="card-title-bar">
            <h3><Plus size={18} style={{ color: 'var(--accent-danger)' }} /> GenAI Incident Command Panel</h3>
            <span style={{ fontSize: '0.8rem', color: '#fca5a5', background: 'rgba(239, 68, 68, 0.1)', padding: '2px 8px', borderRadius: '10px' }}>
              Decision Support
            </span>
          </div>

          <form onSubmit={handleGeneratePlan} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select 
                  className="form-input" 
                  value={incidentCategory} 
                  onChange={(e) => setIncidentCategory(e.target.value)}
                >
                  <option value="Medical">Medical Urgent</option>
                  <option value="Security">Security Detail</option>
                  <option value="Crowd Control">Crowd Control</option>
                  <option value="Facility">Facility/Janitorial</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Location</label>
                <select 
                  className="form-input" 
                  value={incidentLocation}
                  onChange={(e) => setIncidentLocation(e.target.value)}
                >
                  <option value="Section 101">Section 101</option>
                  <option value="Section 105">Section 105</option>
                  <option value="Section 203">Section 203</option>
                  <option value="Gate Entry A">Gate Entry A</option>
                  <option value="Gate Entry C">Gate Entry C</option>
                  <option value="Concourse West">Concourse West</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Severity</label>
                <select 
                  className="form-input" 
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value)}
                >
                  <option value="Low">Low Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="High">High Priority</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Incident Description / Details</label>
              <textarea 
                className="form-input" 
                rows="2"
                style={{ resize: 'none' }}
                placeholder="Describe the incident (e.g. Water spill leaking from refrigeration unit, wheelchair fan requesting assistance, or high crowd density backlog at turnstile 4)..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <button 
              type="submit" 
              className="btn-primary" 
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px' }}
              disabled={isPlanning || !description.trim()}
            >
              {isPlanning ? (
                <>Analyzing Incident logs...</>
              ) : (
                <>
                  <Send size={16} /> Run AI Decision Planner
                </>
              )}
            </button>
          </form>

          {/* AI Decision planner results */}
          {aiPlan && (
            <div style={{ marginTop: '16px', padding: '16px', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '10px' }}>
              <div className="flex-row-space-between" style={{ marginBottom: '8px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--accent-danger)' }}>
                  ⚠️ AI RESPONSE PLAN GENERATED: {aiPlan.priority}
                </span>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                  Target: {aiPlan.team}
                </span>
              </div>

              <p style={{ fontSize: '0.85rem', marginBottom: '10px', color: '#fff', borderLeft: '3px solid var(--accent-danger)', paddingLeft: '8px' }}>
                <strong>Broadcast Command Text:</strong> "{aiPlan.broadcast}"
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '14px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#94a3b8' }}>Checklist Checklist (Dispatched to volunteers):</span>
                {aiPlan.steps.map((step, idx) => (
                  <div key={idx} style={{ fontSize: '0.8rem', display: 'flex', gap: '8px', color: '#cbd5e1' }}>
                    <span style={{ color: 'var(--accent-danger)', fontWeight: 'bold' }}>{idx + 1}.</span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  onClick={handleApproveDispatch}
                  className="btn-danger" 
                  style={{ flex: 1, padding: '8px', fontSize: '0.85rem' }}
                >
                  Approve & Deploy to Volunteers
                </button>
                <button 
                  onClick={() => setAiPlan(null)}
                  className="btn-secondary" 
                  style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                >
                  Cancel Plan
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT COLUMN: Stadium Sustainability Grid */}
      <div className="glass-card glow-green" style={{ height: 'fit-content' }}>
        <div className="card-title-bar">
          <h3><Zap size={18} style={{ color: 'var(--accent-fifa)' }} /> Dynamic Sustainability Grid</h3>
          <span style={{ fontSize: '0.8rem', color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '2px 8px', borderRadius: '10px' }}>
            Eco Optimizer
          </span>
        </div>

        <p style={{ fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '16px' }}>
          Real-time stadium resource consumption with AI optimization switches. Active stadium: <strong>{activeStadium}</strong>.
        </p>

        {/* Meters */}
        <div className="flex-column-gap-16" style={{ marginBottom: '20px' }}>
          <div>
            <div className="flex-row-space-between" style={{ fontSize: '0.8rem', marginBottom: '4px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Zap size={14} style={{ color: 'var(--accent-gold)' }} /> Power Grid Load</span>
              <span style={{ fontWeight: 'bold' }}>{hvacOptimized ? '810 kW (Eco-Optimized)' : '950 kW'}</span>
            </div>
            <div style={{ width: '100%', height: '8px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
              <div 
                style={{ 
                  width: hvacOptimized ? '60%' : '80%', 
                  height: '100%', 
                  backgroundColor: hvacOptimized ? 'var(--accent-fifa)' : 'var(--accent-warning)', 
                  transition: 'width 0.4s ease' 
                }} 
              />
            </div>
          </div>

          <div>
            <div className="flex-row-space-between" style={{ fontSize: '0.8rem', marginBottom: '4px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Droplets size={14} style={{ color: 'var(--accent-cyber)' }} /> Water System Pressure</span>
              <span style={{ fontWeight: 'bold' }}>{waterOptimized ? '42 PSI (Demand Controlled)' : '58 PSI'}</span>
            </div>
            <div style={{ width: '100%', height: '8px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
              <div 
                style={{ 
                  width: waterOptimized ? '50%' : '75%', 
                  height: '100%', 
                  backgroundColor: 'var(--accent-cyber)', 
                  transition: 'width 0.4s ease' 
                }} 
              />
            </div>
          </div>

          <div>
            <div className="flex-row-space-between" style={{ fontSize: '0.8rem', marginBottom: '4px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Trash2 size={14} style={{ color: '#94a3b8' }} /> Landfill Waste Diversion</span>
              <span style={{ fontWeight: 'bold' }}>{recycleBoost ? '64% (Points Boost Active)' : '48%'}</span>
            </div>
            <div style={{ width: '100%', height: '8px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
              <div 
                style={{ 
                  width: recycleBoost ? '64%' : '48%', 
                  height: '100%', 
                  backgroundColor: 'var(--accent-fifa)', 
                  transition: 'width 0.4s ease' 
                }} 
              />
            </div>
          </div>
        </div>

        {/* Toggles */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div className="toggle-switch-container">
            <div>
              <span style={{ fontSize: '0.85rem', fontWeight: 'bold', display: 'block' }}>Dynamic HVAC Duty Cycle</span>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Reduces cooling in low-attendance VIP suites</span>
            </div>
            <label className="switch">
              <input 
                type="checkbox" 
                checked={hvacOptimized}
                onChange={() => setHvacOptimized(!hvacOptimized)}
              />
              <span className="slider"></span>
            </label>
          </div>

          <div className="toggle-switch-container">
            <div>
              <span style={{ fontSize: '0.85rem', fontWeight: 'bold', display: 'block' }}>Smart Water Flow Regulators</span>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Optimizes faucet flow rates during half-time peaks</span>
            </div>
            <label className="switch">
              <input 
                type="checkbox" 
                checked={waterOptimized}
                onChange={() => setWaterOptimized(!waterOptimized)}
              />
              <span className="slider"></span>
            </label>
          </div>

          <div className="toggle-switch-container">
            <div>
              <span style={{ fontSize: '0.85rem', fontWeight: 'bold', display: 'block' }}>AI Reverse Vending Points Boost</span>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Triples points to encourage recycling of bottles</span>
            </div>
            <label className="switch">
              <input 
                type="checkbox" 
                checked={recycleBoost}
                onChange={() => setRecycleBoost(!recycleBoost)}
              />
              <span className="slider"></span>
            </label>
          </div>
        </div>

        {/* AI Recommendations Summary */}
        <div style={{ marginTop: '16px', padding: '12px', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.15)', borderRadius: '8px', fontSize: '0.78rem' }}>
          <strong style={{ color: 'var(--accent-fifa)', display: 'block', marginBottom: '4px' }}>AI Eco-Impact Projection:</strong>
          {hvacOptimized || waterOptimized || recycleBoost ? (
            <div style={{ color: '#cbd5e1' }}>
              {hvacOptimized && <p>• HVAC regulation: saving **140 kW/h** (estimated **92 kg CO2** reduction per hour).</p>}
              {waterOptimized && <p>• Water modulation: conserving **3,200 Liters** during spectator surges.</p>}
              {recycleBoost && <p>• Recycle boost: estimated **1,400+ water bottles** diverted from landfill waste channels.</p>}
            </div>
          ) : (
            <p style={{ color: '#64748b' }}>
              Toggle any of the optimization protocols above to deploy simulated AI sustainability adjustments.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
