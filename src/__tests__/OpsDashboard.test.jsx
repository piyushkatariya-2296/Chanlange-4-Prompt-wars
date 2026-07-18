import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import OpsDashboard from '../components/OpsDashboard';

const MOCK_ALERTS = [
  {
    id: 1,
    type: 'danger',
    message: 'Bottleneck at Gate A turnstiles',
    recommendation: 'Divert traffic to Gate B.'
  }
];

describe('OpsDashboard Operations Commander Tests', () => {
  it('renders Live Smart-Camera Alert feeds and list details', () => {
    render(
      <OpsDashboard 
        activeStadium="MetLife Stadium"
        activeAlerts={MOCK_ALERTS}
        setActiveAlerts={vi.fn()}
        onDispatchTask={vi.fn()}
      />
    );
    expect(screen.getByText('Live AI Smart Camera Alerts')).toBeInTheDocument();
    expect(screen.getByText('Bottleneck at Gate A turnstiles')).toBeInTheDocument();
    expect(screen.getByText(/Divert traffic to Gate B/i)).toBeInTheDocument();
  });

  it('triggers Resolve event when Resolve & Dismiss button is clicked', () => {
    const mockSetAlerts = vi.fn();
    render(
      <OpsDashboard 
        activeStadium="MetLife Stadium"
        activeAlerts={MOCK_ALERTS}
        setActiveAlerts={mockSetAlerts}
        onDispatchTask={vi.fn()}
      />
    );
    const resolveBtn = screen.getByRole('button', { name: /Resolve & Dismiss/i });
    fireEvent.click(resolveBtn);
    expect(mockSetAlerts).toHaveBeenCalled();
  });

  it('renders sustainability dials and grid toggles', () => {
    render(
      <OpsDashboard 
        activeStadium="MetLife Stadium"
        activeAlerts={[]}
        setActiveAlerts={vi.fn()}
        onDispatchTask={vi.fn()}
      />
    );
    expect(screen.getByText('Power Grid Load')).toBeInTheDocument();
    expect(screen.getByText('Smart Water Flow Regulators')).toBeInTheDocument();
    
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes.length).toBe(3); // HVAC, Water, Waste Toggles
  });

  it('allows filling out the Incident Commander form', () => {
    render(
      <OpsDashboard 
        activeStadium="MetLife Stadium"
        activeAlerts={[]}
        setActiveAlerts={vi.fn()}
        onDispatchTask={vi.fn()}
      />
    );
    const textarea = screen.getByPlaceholderText(/Describe the incident/i);
    fireEvent.change(textarea, { target: { value: 'Water leak Section 102 concourse.' } });
    expect(textarea.value).toBe('Water leak Section 102 concourse.');
  });
});
