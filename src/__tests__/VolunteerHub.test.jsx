import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import VolunteerHub from '../components/VolunteerHub';

const MOCK_TASKS = [
  {
    id: 1,
    title: 'Wheelchair Assistance',
    description: 'Assist fan to Row 12.',
    priority: 'Normal',
    status: 'pending',
    completedSteps: [],
    actionSteps: ['Check point A', 'Check point B']
  }
];

describe('VolunteerHub Component Tests', () => {
  it('renders Duty Tasks list, Translation module, and Floor Incident Reporter', () => {
    render(
      <VolunteerHub 
        tasks={MOCK_TASKS}
        setTasks={vi.fn()}
        activeStadium="MetLife Stadium"
        onReportIncident={vi.fn()}
      />
    );
    expect(screen.getByText('AI-Allocated Duty Tasks')).toBeInTheDocument();
    expect(screen.getByText('Multilingual Fan Assist')).toBeInTheDocument();
    expect(screen.getByText('Floor Incident Reporter')).toBeInTheDocument();
  });

  it('allows checking off task steps and resolving tasks', () => {
    const mockSetTasks = vi.fn();
    render(
      <VolunteerHub 
        tasks={MOCK_TASKS}
        setTasks={mockSetTasks}
        activeStadium="MetLife Stadium"
        onReportIncident={vi.fn()}
      />
    );

    // Verify task title is present
    expect(screen.getByText('Wheelchair Assistance')).toBeInTheDocument();

    // Verify steps render
    const step1Checkbox = screen.getAllByRole('checkbox')[0];
    fireEvent.click(step1Checkbox);
    expect(mockSetTasks).toHaveBeenCalled();

    // Verify complete task button is present
    const resolveBtn = screen.getByRole('button', { name: /Mark Assignment Resolved/i });
    expect(resolveBtn).toBeInTheDocument();
    
    fireEvent.click(resolveBtn);
    expect(mockSetTasks).toHaveBeenCalled();
  });

  it('handles translation presets correctly and updates guided response panels', () => {
    render(
      <VolunteerHub 
        tasks={[]}
        setTasks={vi.fn()}
        activeStadium="MetLife Stadium"
        onReportIncident={vi.fn()}
      />
    );

    // Initial state is "lost_found" and Spanish "es"
    expect(screen.getByText('FAN SAYS (Translated Native Text):')).toBeInTheDocument();
    expect(screen.getByText(/¿Dónde está la oficina de objetos perdidos?/i)).toBeInTheDocument();
    expect(screen.getByText(/Lost and Found is located at Guest Services Section 108/i)).toBeInTheDocument();
    expect(screen.getByText(/La oficina de objetos perdidos está en la Sección 108/i)).toBeInTheDocument();

    // Switch language to French
    const langSelect = screen.getByLabelText(/Select Fan’s Native Language/i);
    fireEvent.change(langSelect, { target: { value: 'fr' } });
    expect(screen.getByText(/Où se trouve le bureau des objets trouvés/i)).toBeInTheDocument();
  });

  it('simulates custom phrase translations with Gemini AI API', async () => {
    vi.useFakeTimers();
    render(
      <VolunteerHub 
        tasks={[]}
        setTasks={vi.fn()}
        activeStadium="MetLife Stadium"
        onReportIncident={vi.fn()}
      />
    );

    const customInput = screen.getByPlaceholderText(/e.g. Please follow me to the exit/i);
    const translateBtn = screen.getByRole('button', { name: /Translate/i });

    fireEvent.change(customInput, { target: { value: 'Follow me please.' } });
    fireEvent.click(translateBtn);

    // Wait for the timer
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(screen.getByText(/Señor\/Señora, por favor siga mis instrucciones/i)).toBeInTheDocument();
    vi.useRealTimers();
  });

  it('submits a floor incident report to headquarters command center', () => {
    const mockReportIncident = vi.fn();
    window.alert = vi.fn();
    render(
      <VolunteerHub 
        tasks={[]}
        setTasks={vi.fn()}
        activeStadium="MetLife Stadium"
        onReportIncident={mockReportIncident}
      />
    );

    const descInput = screen.getByPlaceholderText(/e.g. Liquid spill near/i);
    const submitBtn = screen.getByRole('button', { name: /Submit Field Log to HQ/i });

    fireEvent.change(descInput, { target: { value: 'Spill near restroom.' } });
    fireEvent.click(submitBtn);

    expect(mockReportIncident).toHaveBeenCalledWith(expect.objectContaining({
      message: expect.stringContaining('Field Report'),
      recommendation: 'Spill near restroom.'
    }));
    expect(window.alert).toHaveBeenCalledWith(expect.stringContaining('Field report logged'));
  });
});
