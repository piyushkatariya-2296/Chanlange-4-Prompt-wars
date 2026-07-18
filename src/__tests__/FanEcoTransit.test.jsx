import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import FanEcoTransit from '../components/FanEcoTransit';

describe('FanEcoTransit Component Tests', () => {
  it('renders Transit Option Planner and Green Fan Challenge headers', () => {
    render(<FanEcoTransit />);
    expect(screen.getByText('Eco-Transit & Route Planner')).toBeInTheDocument();
    expect(screen.getByText('FIFA Green Fan Challenge')).toBeInTheDocument();
    expect(screen.getByText('0 Points')).toBeInTheDocument();
  });

  it('can select different transit modes and display routing advice', () => {
    render(<FanEcoTransit />);
    
    // Default is Metro
    expect(screen.getByText(/Fastest and greenest. Metro trains exit/i)).toBeInTheDocument();
    
    // Select Electric Stadium Shuttle
    const shuttleCard = screen.getByText('Electric Stadium Shuttle');
    fireEvent.click(shuttleCard);
    expect(screen.getByText(/Departs from all park-and-ride stations/i)).toBeInTheDocument();
  });

  it('calculates points and unlocks badges dynamically as challenges are toggled', () => {
    render(<FanEcoTransit />);
    
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes.length).toBe(5); // 5 Challenges

    // Initially all badges are locked
    const rookieBadge = screen.getByText('Eco Rookie').closest('.badge-item');
    const greenBadge = screen.getByText('Green Fan').closest('.badge-item');
    const champBadge = screen.getByText('Eco Champ').closest('.badge-item');
    
    expect(rookieBadge).not.toHaveClass('unlocked');
    expect(greenBadge).not.toHaveClass('unlocked');
    expect(champBadge).not.toHaveClass('unlocked');

    // Toggle transit challenge (+50 points)
    fireEvent.click(checkboxes[0]);
    expect(screen.getByText('50 Points')).toBeInTheDocument();
    expect(rookieBadge).toHaveClass('unlocked');
    expect(greenBadge).not.toHaveClass('unlocked');

    // Toggle reusable bottle challenge (+30 points)
    fireEvent.click(checkboxes[1]);
    expect(screen.getByText('80 Points')).toBeInTheDocument();
    expect(rookieBadge).toHaveClass('unlocked');
    expect(greenBadge).not.toHaveClass('unlocked');

    // Toggle recycling challenge (+40 points) -> Total 120
    fireEvent.click(checkboxes[2]);
    expect(screen.getByText('120 Points')).toBeInTheDocument();
    expect(greenBadge).toHaveClass('unlocked');
    expect(champBadge).not.toHaveClass('unlocked');

    // Toggle food challenge (+30 points) -> Total 150
    fireEvent.click(checkboxes[3]);
    expect(screen.getByText('150 Points')).toBeInTheDocument();
    expect(champBadge).toHaveClass('unlocked');
  });

  it('allows claiming FIFA store rewards once user reaches 150 points', () => {
    window.alert = vi.fn(); // Mock alert dialog
    render(<FanEcoTransit />);
    
    const checkboxes = screen.getAllByRole('checkbox');
    
    // Check challenges to reach 150 points
    fireEvent.click(checkboxes[0]); // +50
    fireEvent.click(checkboxes[1]); // +30
    fireEvent.click(checkboxes[2]); // +40
    fireEvent.click(checkboxes[3]); // +30 -> Total 150
    
    const claimButton = screen.getByRole('button', { name: /Claim FIFA Store Reward/i });
    expect(claimButton).toBeInTheDocument();
    
    fireEvent.click(claimButton);
    expect(window.alert.mock.calls[0][0]).toContain('ECOFAN2026');
    expect(screen.getByText(/Reward Claimed: Code: \*\*ECOFAN2026\*\*/i)).toBeInTheDocument();
  });
});
