import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import GeminiAssistant from '../components/GeminiAssistant';

describe('GeminiAssistant Conversational AI & API settings Tests', () => {
  it('renders chatbot title and default assistant welcome message', () => {
    render(<GeminiAssistant activeStadium="MetLife Stadium" activeRole="Fan" />);
    expect(screen.getByText('ArenaAI Copilot')).toBeInTheDocument();
    expect(screen.getByText(/Hello! I am ArenaAI, your Generative AI assistant/i).closest('.chat-bubble')).toBeInTheDocument();
  });

  it('can open and close the API Key drawer', () => {
    render(<GeminiAssistant activeStadium="MetLife Stadium" activeRole="Fan" />);
    const settingsBtn = screen.getByRole('button', { name: /Toggle Gemini API Key configuration Settings/i });
    expect(screen.queryByLabelText(/Google Gemini API Key/i)).not.toBeInTheDocument();
    
    // Open settings drawer
    fireEvent.click(settingsBtn);
    expect(screen.getByLabelText(/Google Gemini API Key/i)).toBeInTheDocument();
    
    // Close settings drawer
    fireEvent.click(settingsBtn);
    expect(screen.queryByLabelText(/Google Gemini API Key/i)).not.toBeInTheDocument();
  });

  it('appends user query to chat log when input form is submitted', () => {
    render(<GeminiAssistant activeStadium="MetLife Stadium" activeRole="Fan" />);
    const input = screen.getByPlaceholderText(/Ask ArenaAI for/i);
    const sendBtn = screen.getByRole('button', { name: /Send message/i });
    
    fireEvent.change(input, { target: { value: 'How do I recycle bottles?' } });
    fireEvent.click(sendBtn);
    
    expect(screen.getByText('How do I recycle bottles?').closest('.chat-bubble')).toBeInTheDocument();
  });

  it('triggers AI response when clicking quick prompt scenario cards', () => {
    render(<GeminiAssistant activeStadium="MetLife Stadium" activeRole="Fan" />);
    const accessibilityBtn = screen.getByRole('button', { name: /Analyze Section 101 wheelchair route/i });
    
    fireEvent.click(accessibilityBtn);
    expect(screen.getByText('[Scenario Run]: Wheelchair ADA navigation route').closest('.chat-bubble')).toBeInTheDocument();
  });
});
