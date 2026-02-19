/**
 * Global app color theme. Use these constants everywhere instead of hardcoded hex values.
 */
export const colors = {
  // Primary brand (progress bars, amounts, buttons, links)
  primary: '#4CAF50',

  // Header / navigation
  headerBackground: '#FFD700',
  headerText: '#000',

  // Backgrounds
  background: '#f5f5f5',
  surface: '#fff',
  surfaceMuted: '#e0e0e0',

  // Text
  text: '#333',
  textSecondary: '#666',
  textMuted: '#999',

  // Error
  error: '#d32f2f',

  // Success (overlay, cards)
  successBackground: '#E8F5E9',
  successTitle: '#2E7D32',
  successSubtitle: '#1B5E20',

  // UI
  shadow: '#000',
} as const;

export type AppColors = typeof colors;
