import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import StadiumMap from '../components/StadiumMap';

const MOCK_STADIUM_DATA = {
  '101': {
    name: 'Zone 101',
    density: 85,
    gateWait: 20,
    concessionWait: 15,
    restroomWait: 8,
    exitGate: 'Gate A',
    aiRecommendation: 'Divert Section 101 guests to Exit Gate D to bypass Gate A queue.'
  },
  '105': {
    name: 'Zone 105',
    density: 40,
    gateWait: 5,
    concessionWait: 4,
    restroomWait: 2,
    exitGate: 'Gate C',
    aiRecommendation: 'Crowd normal. Regular entry path clear.'
  }
};

describe('StadiumMap Component Accessibility & Interactive Tests', () => {
  it('renders SVG bowl map structure and exit gate titles', () => {
    render(
      <StadiumMap 
        selectedSection="101"
        setSelectedSection={vi.fn()}
        stadiumData={MOCK_STADIUM_DATA}
        simulationMode="arrival"
      />
    );
    expect(screen.getByText('Interactive Arena Flow')).toBeInTheDocument();
    expect(screen.getByText('GATE A')).toBeInTheDocument();
    expect(screen.getByText('GATE B')).toBeInTheDocument();
  });

  it('sets up correct aria-label attributes and roles on SVG sectors', () => {
    render(
      <StadiumMap 
        selectedSection="101"
        setSelectedSection={vi.fn()}
        stadiumData={MOCK_STADIUM_DATA}
        simulationMode="arrival"
      />
    );
    const sector101 = screen.getByRole('button', { name: /Section 101 - Inner North. Current crowd density 85 percent/i });
    expect(sector101).toBeInTheDocument();
    expect(sector101).toHaveAttribute('tabindex', '0');
  });

  it('triggers setSelectedSection callback on sector button click', () => {
    const mockSetSelected = vi.fn();
    render(
      <StadiumMap 
        selectedSection=""
        setSelectedSection={mockSetSelected}
        stadiumData={MOCK_STADIUM_DATA}
        simulationMode="arrival"
      />
    );
    const sector105 = screen.getByRole('button', { name: /Section 105 - Inner South/i });
    fireEvent.click(sector105);
    expect(mockSetSelected).toHaveBeenCalledWith('105');
  });

  it('triggers setSelectedSection callback on sector button keypress', () => {
    const mockSetSelected = vi.fn();
    render(
      <StadiumMap 
        selectedSection=""
        setSelectedSection={mockSetSelected}
        stadiumData={MOCK_STADIUM_DATA}
        simulationMode="arrival"
      />
    );
    const sector105 = screen.getByRole('button', { name: /Section 105 - Inner South/i });
    
    // Press Space key
    fireEvent.keyDown(sector105, { key: ' ', code: 'Space' });
    expect(mockSetSelected).toHaveBeenCalledWith('105');

    // Press Enter key
    fireEvent.keyDown(sector105, { key: 'Enter', code: 'Enter' });
    expect(mockSetSelected).toHaveBeenCalledWith('105');
  });

  it('displays detailed queue times when a section is active', () => {
    render(
      <StadiumMap 
        selectedSection="101"
        setSelectedSection={vi.fn()}
        stadiumData={MOCK_STADIUM_DATA}
        simulationMode="arrival"
      />
    );
    expect(screen.getByText('Section 101 (Zone 101)')).toBeInTheDocument();
    expect(screen.getByText('85% Density')).toBeInTheDocument();
    expect(screen.getByText('8m')).toBeInTheDocument(); // restroom
    expect(screen.getByText('15m')).toBeInTheDocument(); // concession
    expect(screen.getByText(/Divert Section 101 guests to Exit Gate D/i)).toBeInTheDocument();
  });
});
