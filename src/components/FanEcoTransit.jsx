import React, { useState } from 'react';
import { Leaf, Navigation, Award, Train, Bus, Car, Zap, CheckSquare, ShieldCheck } from 'lucide-react';

const TRANSIT_MODES = [
  {
    id: 'metro',
    name: 'Metro Link Express',
    wait: '4 mins',
    duration: '22 mins',
    emissions: 0.12, // kg CO2
    rating: 'low',
    cost: '$2.75',
    icon: Train,
    advice: 'Fastest and greenest. Metro trains exit directly at the Stadium West Gate A walkway.'
  },
  {
    id: 'shuttle',
    name: 'Electric Stadium Shuttle',
    wait: '6 mins',
    duration: '28 mins',
    emissions: 0.18,
    rating: 'low',
    cost: 'Free (with ticket)',
    icon: Bus,
    advice: 'Departs from all park-and-ride stations. Shuttles use dedicated bus lanes to bypass general traffic.'
  },
  {
    id: 'rideshare',
    name: 'EV Rideshare (Eco-Tier)',
    wait: '9 mins',
    duration: '35 mins',
    emissions: 0.42,
    rating: 'medium',
    cost: '$22.00',
    icon: Car,
    advice: 'Drop-off zone is located at Lot F (8-minute walk to East Gate B). High congestion expected post-match.'
  },
  {
    id: 'car',
    name: 'Personal Petrol Car',
    wait: 'None',
    duration: '45 mins',
    emissions: 2.95,
    rating: 'high',
    cost: '$35.00 parking',
    icon: Car,
    advice: 'High traffic backup on major exits. Parking Lot E is at 82% capacity. EV charging slots are fully occupied.'
  }
];

const ECO_CHALLENGES = [
  { id: 'transit', label: 'Use public transit or eco-shuttle to get to the arena', points: 50 },
  { id: 'bottle', label: 'Bring a reusable water bottle (empty for gate inspection)', points: 30 },
  { id: 'vending', label: 'Recycle a plastic bottle at an AI Reverse Vending Machine', points: 40 },
  { id: 'food', label: 'Purchase a plant-based food option at Concession 112', points: 30 },
  { id: 'carpool', label: 'Carpool with 3 or more ticket holders (Lot E entry)', points: 30 }
];

export default function FanEcoTransit() {
  const [selectedTransit, setSelectedTransit] = useState('metro');
  const [checkedChallenges, setCheckedChallenges] = useState([]);
  const [rewardsClaimed, setRewardsClaimed] = useState(false);

  const handleChallengeToggle = (id) => {
    setCheckedChallenges(prev => 
      prev.includes(id) 
        ? prev.filter(cId => cId !== id) 
        : [...prev, id]
    );
  };

  // Calculate current score
  const totalPoints = ECO_CHALLENGES.filter(c => checkedChallenges.includes(c.id))
                                    .reduce((sum, c) => sum + c.points, 0);

  const getTransitDetails = () => TRANSIT_MODES.find(m => m.id === selectedTransit);
  const activeTransit = getTransitDetails();

  const isUnlocked = (badgeType) => {
    if (badgeType === 'rookie') return totalPoints >= 50;
    if (badgeType === 'supporter') return totalPoints >= 100;
    if (badgeType === 'champion') return totalPoints >= 150;
    return false;
  };

  const handleClaimReward = () => {
    if (totalPoints < 150) return;
    setRewardsClaimed(true);
    alert('Congratulations! Your FIFA 2026 digital Eco-Badge has been minted, and a 15% concessions voucher code [ECOFAN2026] is added to your account.');
  };

  return (
    <div className="dashboard-grid">
      {/* LEFT COLUMN: Eco-Transit Planner */}
      <div className="glass-card glow-indigo">
        <div className="card-title-bar">
          <h3><Navigation size={18} style={{ color: 'var(--accent-cyber)' }} /> Eco-Transit & Route Planner</h3>
          <span style={{ fontSize: '0.8rem', color: '#06b6d4', background: 'rgba(6, 182, 212, 0.1)', padding: '2px 8px', borderRadius: '10px' }}>
            Real-time Routing
          </span>
        </div>

        <p style={{ fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '14px' }}>
          Compare transportation methods to the match. Lowering your transport carbon footprint helps unlock FIFA Green badges.
        </p>

        <div className="transit-options" style={{ marginBottom: '16px' }}>
          {TRANSIT_MODES.map((mode) => {
            const IconComponent = mode.icon;
            return (
              <div 
                key={mode.id}
                className={`transit-card ${selectedTransit === mode.id ? 'selected' : ''}`}
                onClick={() => setSelectedTransit(mode.id)}
              >
                <div className="transit-icon-details">
                  <div className="transit-icon-box">
                    <IconComponent size={20} />
                  </div>
                  <div>
                    <span className="transit-mode-name">{mode.name}</span>
                    <span className="transit-mode-subtext" style={{ display: 'block' }}>
                      Wait: {mode.wait} | Duration: {mode.duration}
                    </span>
                  </div>
                </div>

                <div className="transit-metrics">
                  <span style={{ fontSize: '0.85rem', fontWeight: 'bold', display: 'block' }}>{mode.cost}</span>
                  <span className={`transit-carbon-badge ${mode.rating === 'high' ? 'high' : ''}`}>
                    {mode.emissions} kg CO₂
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {activeTransit && (
          <div style={{ padding: '12px', background: 'rgba(6, 182, 212, 0.05)', border: '1px solid rgba(6, 182, 212, 0.15)', borderRadius: '8px', fontSize: '0.82rem' }}>
            <strong style={{ color: 'var(--accent-cyber)', display: 'block', marginBottom: '4px' }}>
              Gemini Transit Advisor Recommendation:
            </strong>
            <p style={{ color: '#cbd5e1' }}>{activeTransit.advice}</p>
          </div>
        )}
      </div>

      {/* RIGHT COLUMN: Fan Eco Challenge & Badges */}
      <div className="glass-card glow-green" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div className="card-title-bar">
          <h3><Award size={18} style={{ color: 'var(--accent-fifa)' }} /> FIFA Green Fan Challenge</h3>
          <span style={{ fontSize: '0.85rem', color: 'var(--accent-fifa)', fontWeight: 'bold' }}>
            {totalPoints} Points
          </span>
        </div>

        <p style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
          Participate in our tournament sustainability initiatives, complete challenges on match day, and claim official FIFA store rewards.
        </p>

        {/* Challenge checkboxes */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {ECO_CHALLENGES.map((challenge) => (
            <div key={challenge.id} className="challenge-item">
              <input 
                type="checkbox"
                id={challenge.id}
                className="challenge-checkbox"
                checked={checkedChallenges.includes(challenge.id)}
                onChange={() => handleChallengeToggle(challenge.id)}
              />
              <div className="challenge-details">
                <label htmlFor={challenge.id} className="challenge-title" style={{ color: '#f1f5f9', cursor: 'pointer' }}>
                  {challenge.label}
                </label>
                <span className="challenge-points" style={{ display: 'block' }}>+{challenge.points} Points</span>
              </div>
            </div>
          ))}
        </div>

        {/* Badges showcase */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '16px' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#94a3b8', display: 'block', marginBottom: '12px', textAlign: 'center' }}>
            Eco Achievement Badges
          </span>

          <div className="badge-showcase">
            <div className={`badge-item ${isUnlocked('rookie') ? 'unlocked' : ''}`}>
              <div className="badge-icon-circle">
                <Leaf size={20} />
              </div>
              <span className="badge-name">Eco Rookie</span>
              <span style={{ fontSize: '0.6rem', color: '#64748b' }}>50 Pts</span>
            </div>

            <div className={`badge-item ${isUnlocked('supporter') ? 'unlocked' : ''}`}>
              <div className="badge-icon-circle">
                <Zap size={20} />
              </div>
              <span className="badge-name">Green Fan</span>
              <span style={{ fontSize: '0.6rem', color: '#64748b' }}>100 Pts</span>
            </div>

            <div className={`badge-item ${isUnlocked('champion') ? 'unlocked' : ''}`}>
              <div className="badge-icon-circle">
                <Award size={20} />
              </div>
              <span className="badge-name">Eco Champ</span>
              <span style={{ fontSize: '0.6rem', color: '#64748b' }}>150 Pts</span>
            </div>
          </div>
        </div>

        {/* Claim Reward Button */}
        {totalPoints >= 150 ? (
          <div style={{ marginTop: 'auto' }}>
            {rewardsClaimed ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--accent-fifa)', borderRadius: '10px', color: '#fff', fontSize: '0.85rem' }}>
                <ShieldCheck size={16} style={{ color: 'var(--accent-fifa)' }} /> Reward Claimed: Code: **ECOFAN2026**
              </div>
            ) : (
              <button 
                onClick={handleClaimReward}
                className="btn-primary" 
                style={{ width: '100%', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
              >
                🏆 Claim FIFA Store Reward (15% Off)
              </button>
            )}
          </div>
        ) : (
          <div style={{ marginTop: 'auto', textAlign: 'center', fontSize: '0.78rem', color: '#64748b', padding: '10px', backgroundColor: 'rgba(255,255,255,0.01)', borderRadius: '8px' }}>
            🔒 Earn **{150 - totalPoints} more points** to unlock the Concessions Voucher.
          </div>
        )}
      </div>
    </div>
  );
}
