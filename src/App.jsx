import React, { useState, useEffect } from 'react';
import { Shield, Sparkles, AlertTriangle, Compass, MapPin, Eye, Zap, Languages, ClipboardList, HelpCircle, Activity } from 'lucide-react';
import StadiumMap from './components/StadiumMap';
import GeminiAssistant from './components/GeminiAssistant';
import OpsDashboard from './components/OpsDashboard';
import FanEcoTransit from './components/FanEcoTransit';
import VolunteerHub from './components/VolunteerHub';

const STADIUMS = [
  { id: 'metlife', name: 'MetLife Stadium (NY/NJ)', capacity: 82500, city: 'East Rutherford' },
  { id: 'azteca', name: 'Estadio Azteca (Mexico City)', capacity: 87523, city: 'Mexico City' },
  { id: 'bcplace', name: 'BC Place (Vancouver)', capacity: 54500, city: 'Vancouver' }
];

const SIMULATION_MODES = [
  { id: 'arrival', label: 'Pre-Match Fan Arrival' },
  { id: 'halftime', label: 'Halftime Ingress Surge' },
  { id: 'departure', label: 'Post-Match Departure' },
  { id: 'emergency', label: 'Evacuation Simulation' }
];

const DEFAULT_ALERTS = [
  {
    id: 1,
    type: 'danger',
    message: 'AI COMPUTER VISION: Turnstile bottleneck at Plaza Gate A. Ingress flow capacity exceeded by 24%.',
    recommendation: 'Open Auxiliary Gate C turnstiles and update digital exterior signage to divert Section 100/200 ticket holders.'
  },
  {
    id: 2,
    type: 'warning',
    message: 'LOGISTICS INCIDENT: Concourse spill detected near Section 203 escalators.',
    recommendation: 'Alert Section 203 volunteer lead to place safety warning signs and dispatch facility cleanup team #2.'
  }
];

const INITIAL_TASKS = [
  {
    id: 101,
    title: 'Wheelchair Assistance Request',
    description: 'Assist elderly fan from Gate A ticketing area to Section 101 ADA row.',
    priority: 'Normal',
    status: 'pending',
    completedSteps: [],
    actionSteps: [
      'Locate fan at Gate A main entry checkpoint.',
      'Provide ADA-compliant transit wheelchair.',
      'Escort fan using West elevator bank to Row 12 (ADA platform).',
      'Confirm fan comfort and return wheelchair to Gate A depot.'
    ]
  },
  {
    id: 102,
    title: 'Resolve Escalator Congestion',
    description: 'Direct fan traffic at the Section 203 escalator base.',
    priority: 'High',
    status: 'pending',
    completedSteps: [],
    actionSteps: [
      'Head to Section 203 concourse junction.',
      'Deploy queue barrier tapes to stream human flow.',
      'Use PA megaphone: "Please keep moving towards Section 204 corridors."',
      'Signal HQ once elevator backup drops below 30 people.'
    ]
  }
];

// Helper to generate dynamic stadium statistics based on Stadium choice and Simulation mode
const generateStadiumData = (stadiumId, modeId) => {
  const sections = ['101', '102', '103', '104', '105', '106', '107', '108', '201', '203', '205', '207', 'VIP-A', 'VIP-B', 'VIP-C', 'VIP-D'];
  const baseData = {};

  sections.forEach((sec) => {
    let density = 30;
    let gateWait = 5;
    let concessionWait = 4;
    let restroomWait = 2;
    let exitGate = 'Gate A';
    let aiRecommendation = 'Crowd flow normal. Regular entry path clear.';

    // Base properties based on section category
    if (sec.startsWith('2')) {
      exitGate = 'Gate B';
    } else if (sec.startsWith('VIP')) {
      exitGate = 'VIP Plaza Gate E';
    } else {
      // 100s
      exitGate = sec === '105' || sec === '106' ? 'Gate C' : sec === '107' || sec === '108' ? 'Gate D' : 'Gate A';
    }

    // Modify statistics dynamically based on Simulation Mode
    switch (modeId) {
      case 'arrival':
        // High density around gates and entry concourses (101, 102, 108, VIP-A)
        if (['101', '102', '108', '201', 'VIP-A'].includes(sec)) {
          density = 88;
          gateWait = 22;
          concessionWait = 14;
          restroomWait = 6;
          aiRecommendation = `⚠️ HIGH ARRIVAL DENSITY: Directing Section ${sec} arrivals to enter via auxiliary Gate D to bypass Gate A queuing.`;
        } else {
          density = 40;
          gateWait = 8;
        }
        break;
      case 'halftime':
        // Extreme density around food concourses (103, 105, 203, 205) and restrooms
        if (['103', '105', '107', '203', '205'].includes(sec)) {
          density = 94;
          concessionWait = 24;
          restroomWait = 18;
          aiRecommendation = `⚠️ HALF-TIME PEAK: Restrooms in Sector ${sec} are congested. Nearest low-wait restrooms are located at Section 102 (3-minute walk).`;
        } else {
          density = 45;
          concessionWait = 8;
          restroomWait = 4;
        }
        break;
      case 'departure':
        // High density around exits (105, 106, 205, VIP-C)
        if (['105', '106', '205', 'VIP-C', '104', 'VIP-D'].includes(sec)) {
          density = 92;
          gateWait = 28;
          aiRecommendation = `⚠️ EGRESS CONGESTION: Exit route at ${exitGate} is heavily bottlenecked. Guide guests in Section ${sec} through Exit Gate D (flow density is 40% lower).`;
        } else {
          density = 35;
          gateWait = 6;
        }
        break;
      case 'emergency':
        // Extreme danger and urgency across the board
        density = 98;
        gateWait = 35;
        concessionWait = 0; // Concessions closed
        restroomWait = 0;
        aiRecommendation = `🚨 EMERGENCY EVACUATION: Section ${sec} guests must evacuate immediately through emergency exit corridors leading to Lot F. Follow green strobe guides.`;
        break;
      default:
        density = 45;
    }

    baseData[sec] = {
      name: sec.startsWith('VIP') ? `VIP Suite ${sec.split('-')[1]}` : `Zone ${sec}`,
      density,
      gateWait,
      concessionWait,
      restroomWait,
      exitGate,
      aiRecommendation
    };
  });

  return baseData;
};

export default function App() {
  const [activeRole, setActiveRole] = useState('fan'); // 'fan', 'staff', 'volunteer'
  const [selectedStadium, setSelectedStadium] = useState('metlife');
  const [simulationMode, setSimulationMode] = useState('arrival');
  const [selectedSection, setSelectedSection] = useState('101');
  
  // Tab states for different roles
  const [fanTab, setFanTab] = useState('map'); // 'map', 'transit', 'copilot'
  const [staffTab, setStaffTab] = useState('map'); // 'map', 'ops', 'copilot'
  const [volunteerTab, setVolunteerTab] = useState('tasks'); // 'tasks', 'hub', 'copilot'
  
  const [activeAlerts, setActiveAlerts] = useState(DEFAULT_ALERTS);
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [stadiumData, setStadiumData] = useState(() => generateStadiumData('metlife', 'arrival'));

  // Update stadium data when stadium or simulation mode changes
  useEffect(() => {
    setStadiumData(generateStadiumData(selectedStadium, simulationMode));
    
    // Auto-update emergency warnings in simulation
    if (simulationMode === 'emergency') {
      setActiveAlerts(prev => [
        {
          id: 999,
          type: 'danger',
          message: '🚨 CRITICAL SYSTEM ALARM: Evacuation protocol active. Fire alarms triggered in Plaza West.',
          recommendation: 'Clear all corridors, open emergency service gates, and dispatch volunteers to assist ADA sections.'
        },
        ...prev.filter(a => a.id !== 999)
      ]);
    } else {
      setActiveAlerts(prev => prev.filter(a => a.id !== 999));
    }
  }, [selectedStadium, simulationMode]);

  const activeStadiumDetails = STADIUMS.find(s => s.id === selectedStadium);

  const handleRoleChange = (role) => {
    setActiveRole(role);
  };

  const handleDispatchTask = (newTask) => {
    setTasks(prev => [newTask, ...prev]);
  };

  const handleReportIncident = (newAlert) => {
    setActiveAlerts(prev => [newAlert, ...prev]);
  };

  return (
    <div className="app-container">
      {/* App Header */}
      <header className="app-header">
        <div className="header-left">
          <div className="header-logo">
            <Shield size={24} />
          </div>
          <div className="header-title">
            <h1>ArenaPulse 2026</h1>
            <p>FIFA World Cup Smart Stadium & AI Operations Hub</p>
          </div>
        </div>

        <div className="header-controls">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={15} style={{ color: 'var(--accent-cyber)' }} />
            <select 
              className="select-stadium"
              value={selectedStadium}
              onChange={(e) => setSelectedStadium(e.target.value)}
            >
              {STADIUMS.map(stadium => (
                <option key={stadium.id} value={stadium.id}>
                  {stadium.name}
                </option>
              ))}
            </select>
          </div>

          <div className="role-badge-container">
            <button 
              className={`role-btn ${activeRole === 'fan' ? 'active' : ''}`}
              onClick={() => handleRoleChange('fan')}
            >
              <Compass size={14} /> Fan
            </button>
            <button 
              className={`role-btn role-staff ${activeRole === 'staff' ? 'active' : ''}`}
              onClick={() => handleRoleChange('staff')}
            >
              <Activity size={14} /> Operations
            </button>
            <button 
              className={`role-btn role-volunteer ${activeRole === 'volunteer' ? 'active' : ''}`}
              onClick={() => handleRoleChange('volunteer')}
            >
              <ClipboardList size={14} /> Volunteer
            </button>
          </div>
        </div>
      </header>

      {/* Emergency Global Alert Banner */}
      {activeAlerts.length > 0 && activeAlerts.some(a => a.type === 'danger') && (
        <div className="alert-banner">
          <div className="alert-banner-left">
            <span className="alert-pulse-dot" />
            <span>
              <strong>CRITICAL ALERT:</strong> {activeAlerts.find(a => a.type === 'danger').message}
            </span>
          </div>
          <span style={{ fontSize: '0.8rem', background: 'rgba(0,0,0,0.2)', padding: '2px 8px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)' }}>
            AI Rerouting Active
          </span>
        </div>
      )}

      {/* Mode Simulation Selector (Visible to Staff & Volunteers for testing scenarios, Fans see standard matches) */}
      <div className="glass-card" style={{ padding: '12px 20px', display: 'flex', flexWrap: 'wrap', gap: '14px', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(15, 23, 42, 0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '8px', height: '8px', backgroundColor: 'var(--accent-cyber)', borderRadius: '50%' }}></span>
          <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
            Current Venue Phase: <strong>{SIMULATION_MODES.find(m => m.id === simulationMode)?.label}</strong>
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 'bold' }}>Simulate Match Scenarios:</span>
          <div style={{ display: 'flex', gap: '6px' }}>
            {SIMULATION_MODES.map(mode => (
              <button
                key={mode.id}
                onClick={() => setSimulationMode(mode.id)}
                className={`btn-secondary ${simulationMode === mode.id ? 'active' : ''}`}
                style={{
                  padding: '4px 10px',
                  fontSize: '0.75rem',
                  borderRadius: '6px',
                  backgroundColor: simulationMode === mode.id ? 'rgba(6, 182, 212, 0.15)' : 'transparent',
                  borderColor: simulationMode === mode.id ? 'var(--accent-cyber)' : 'rgba(255,255,255,0.08)'
                }}
              >
                {mode.label.split(' ').pop()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs based on the selected Role */}
      {activeRole === 'fan' && (
        <nav className="nav-tabs">
          <button 
            className={`tab-btn ${fanTab === 'map' ? 'active' : ''}`}
            onClick={() => setFanTab('map')}
          >
            <Compass size={16} /> Stadium Map & AI Rerouting
          </button>
          <button 
            className={`tab-btn ${fanTab === 'transit' ? 'active' : ''}`}
            onClick={() => setFanTab('transit')}
          >
            <Zap size={16} /> Eco-Transit & Green Challenges
          </button>
          <button 
            className={`tab-btn ${fanTab === 'copilot' ? 'active' : ''}`}
            onClick={() => setFanTab('copilot')}
          >
            <Sparkles size={16} style={{ color: 'var(--accent-gold)' }} /> Ask ArenaAI
          </button>
        </nav>
      )}

      {activeRole === 'staff' && (
        <nav className="nav-tabs">
          <button 
            className={`tab-btn ${staffTab === 'map' ? 'active' : ''}`}
            onClick={() => setStaffTab('map')}
          >
            <Compass size={16} /> Interactive Crowd Heatmap
          </button>
          <button 
            className={`tab-btn ${staffTab === 'ops' ? 'active' : ''}`}
            onClick={() => setStaffTab('ops')}
          >
            <Activity size={16} /> Operations Command Panel
          </button>
          <button 
            className={`tab-btn ${staffTab === 'copilot' ? 'active' : ''}`}
            onClick={() => setStaffTab('copilot')}
          >
            <Sparkles size={16} style={{ color: 'var(--accent-gold)' }} /> AI Decision Support Chat
          </button>
        </nav>
      )}

      {activeRole === 'volunteer' && (
        <nav className="nav-tabs">
          <button 
            className={`tab-btn ${volunteerTab === 'tasks' ? 'active' : ''}`}
            onClick={() => setVolunteerTab('tasks')}
          >
            <ClipboardList size={16} /> Duty Tasks Terminal
          </button>
          <button 
            className={`tab-btn ${volunteerTab === 'hub' ? 'active' : ''}`}
            onClick={() => setVolunteerTab('hub')}
          >
            <Languages size={16} /> Multilingual Translator Aid
          </button>
          <button 
            className={`tab-btn ${volunteerTab === 'copilot' ? 'active' : ''}`}
            onClick={() => setVolunteerTab('copilot')}
          >
            <Sparkles size={16} style={{ color: 'var(--accent-gold)' }} /> Volunteer Copilot AI
          </button>
        </nav>
      )}

      {/* Main Dashboard Layout Area */}
      <main style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1 }}>
        {/* FAN EXPERIENCE VIEWS */}
        {activeRole === 'fan' && (
          <>
            {fanTab === 'map' && (
              <div className="dashboard-grid">
                <StadiumMap 
                  selectedSection={selectedSection}
                  setSelectedSection={setSelectedSection}
                  stadiumData={stadiumData}
                  simulationMode={simulationMode}
                />
                <GeminiAssistant 
                  activeStadium={activeStadiumDetails.name}
                  activeRole="Fan"
                />
              </div>
            )}
            {fanTab === 'transit' && (
              <FanEcoTransit />
            )}
            {fanTab === 'copilot' && (
              <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
                <GeminiAssistant 
                  activeStadium={activeStadiumDetails.name}
                  activeRole="Fan"
                />
              </div>
            )}
          </>
        )}

        {/* OPERATIONS STAFF VIEWS */}
        {activeRole === 'staff' && (
          <>
            {staffTab === 'map' && (
              <div className="dashboard-grid">
                <StadiumMap 
                  selectedSection={selectedSection}
                  setSelectedSection={setSelectedSection}
                  stadiumData={stadiumData}
                  simulationMode={simulationMode}
                />
                <OpsDashboard 
                  activeStadium={activeStadiumDetails.name}
                  activeAlerts={activeAlerts}
                  setActiveAlerts={setActiveAlerts}
                  onDispatchTask={handleDispatchTask}
                />
              </div>
            )}
            {staffTab === 'ops' && (
              <OpsDashboard 
                activeStadium={activeStadiumDetails.name}
                activeAlerts={activeAlerts}
                setActiveAlerts={setActiveAlerts}
                onDispatchTask={handleDispatchTask}
              />
            )}
            {staffTab === 'copilot' && (
              <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
                <GeminiAssistant 
                  activeStadium={activeStadiumDetails.name}
                  activeRole="Operations Staff"
                />
              </div>
            )}
          </>
        )}

        {/* VOLUNTEER VIEWS */}
        {activeRole === 'volunteer' && (
          <>
            {volunteerTab === 'tasks' && (
              <div className="dashboard-grid">
                <VolunteerHub 
                  tasks={tasks}
                  setTasks={setTasks}
                  activeStadium={activeStadiumDetails.name}
                  onReportIncident={handleReportIncident}
                />
                <GeminiAssistant 
                  activeStadium={activeStadiumDetails.name}
                  activeRole="Volunteer"
                />
              </div>
            )}
            {volunteerTab === 'hub' && (
              <VolunteerHub 
                tasks={tasks}
                setTasks={setTasks}
                activeStadium={activeStadiumDetails.name}
                onReportIncident={handleReportIncident}
              />
            )}
            {volunteerTab === 'copilot' && (
              <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
                <GeminiAssistant 
                  activeStadium={activeStadiumDetails.name}
                  activeRole="Volunteer"
                />
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer Info */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '16px', color: '#64748b', fontSize: '0.78rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>ArenaPulse Smart Stadium Operations Hub © 2026. Built for FIFA World Cup Challenge.</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Sparkles size={12} style={{ color: 'var(--accent-gold)' }} />
          Powered by Gemini Pro Simulation Engine
        </span>
      </footer>
    </div>
  );
}
