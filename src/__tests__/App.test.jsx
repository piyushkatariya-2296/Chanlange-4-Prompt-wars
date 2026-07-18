import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from '../App';

describe('App Component Core Tests', () => {
  it('renders App Header title and logo successfully', () => {
    render(<App />);
    expect(screen.getByText('ArenaPulse 2026')).toBeInTheDocument();
    expect(screen.getByText('FIFA World Cup Smart Stadium & AI Operations Hub')).toBeInTheDocument();
  });

  it('renders default Fan navigation tabs', () => {
    render(<App />);
    expect(screen.getByText('Stadium Map & AI Rerouting')).toBeInTheDocument();
    expect(screen.getByText('Eco-Transit & Green Challenges')).toBeInTheDocument();
    expect(screen.getByText('Ask ArenaAI')).toBeInTheDocument();
  });

  it('can switch roles to Operations Command', () => {
    render(<App />);
    const opsButton = screen.getByRole('tab', { name: /Operations Staff/i });
    fireEvent.click(opsButton);
    expect(screen.getByText('Interactive Crowd Heatmap')).toBeInTheDocument();
    expect(screen.getByText('Operations Command Panel')).toBeInTheDocument();
  });

  it('can switch roles to Volunteer Handset', () => {
    render(<App />);
    const volButton = screen.getByRole('tab', { name: /Volunteer Handset/i });
    fireEvent.click(volButton);
    expect(screen.getByText('Duty Tasks Terminal')).toBeInTheDocument();
    expect(screen.getByText('Multilingual Translator Aid')).toBeInTheDocument();
  });

  it('allows changing active stadium from dropdown', () => {
    render(<App />);
    const select = screen.getByRole('combobox');
    expect(select.value).toBe('metlife');
    
    fireEvent.change(select, { target: { value: 'azteca' } });
    expect(select.value).toBe('azteca');
  });

  it('allows switching match simulation phases', () => {
    render(<App />);
    expect(screen.getByText(/Pre-Match Fan Arrival/i)).toBeInTheDocument();
    
    // Switch to Halftime
    const halftimeBtn = screen.getByRole('button', { name: /Surge/i });
    fireEvent.click(halftimeBtn);
    expect(screen.getByText(/Halftime Ingress Surge/i)).toBeInTheDocument();
    
    // Switch to Emergency Evacuation
    const emergencyBtn = screen.getByRole('button', { name: /Simulation/i });
    fireEvent.click(emergencyBtn);
    expect(screen.getByText(/Evacuation Simulation/i)).toBeInTheDocument();
    // Emergency alert triggers warning
    expect(screen.getByText(/🚨 CRITICAL SYSTEM ALARM: Evacuation/i)).toBeInTheDocument();
  });
});
