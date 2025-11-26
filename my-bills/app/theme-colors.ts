// Cores do tema Dark e Light
export const getThemeColors = (isDark: boolean) => {
  return {
    background: isDark ? '#121212' : '#F5F7FA',
    surface: isDark ? '#1E1E1E' : '#fff',
    surfaceSecondary: isDark ? '#2D2D2D' : '#F5F5F5',
    text: isDark ? '#fff' : '#1A1A1A',
    textSecondary: isDark ? '#B0B0B0' : '#666',
    textTertiary: isDark ? '#888' : '#999',
    border: isDark ? '#444' : '#e0e0e0',
    borderLight: isDark ? '#333' : '#f0f0f0',
    header: '#1E88E5', // Mesma cor em ambos os temas
    cardBackground: isDark ? '#1E1E1E' : '#fff',
    inputBackground: isDark ? '#1E1E1E' : '#fff',
    inputBorder: isDark ? '#444' : '#DDE3EB',
    placeholder: isDark ? '#888' : '#999',
  };
};

