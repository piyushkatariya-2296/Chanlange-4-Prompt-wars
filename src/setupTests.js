import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Configure global mocks for browser dialogs to prevent test hangs and errors
const mockAlert = vi.fn();
const mockConfirm = vi.fn(() => true);

global.alert = mockAlert;
global.confirm = mockConfirm;

if (typeof window !== 'undefined') {
  window.alert = mockAlert;
  window.confirm = mockConfirm;
}
