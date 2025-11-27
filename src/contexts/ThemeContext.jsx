import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [primaryColor, setPrimaryColor] = useState(
    localStorage.getItem('primaryColor') || '#1e3a8a'
  );
  const [logo, setLogo] = useState(
    localStorage.getItem('logo') || null
  );
  const [tabColors, setTabColors] = useState(() => {
    const saved = localStorage.getItem('tabColors');
    return saved ? JSON.parse(saved) : {};
  });

  // Apply primary color to CSS variable
  useEffect(() => {
    document.documentElement.style.setProperty('--color-primary', primaryColor);
    localStorage.setItem('primaryColor', primaryColor);
  }, [primaryColor]);

  // Save logo
  useEffect(() => {
    if (logo) {
      localStorage.setItem('logo', logo);
    } else {
      localStorage.removeItem('logo');
    }
  }, [logo]);

  // Save tab colors
  useEffect(() => {
    localStorage.setItem('tabColors', JSON.stringify(tabColors));
  }, [tabColors]);

  const removeLogo = () => {
    setLogo(null);
    localStorage.removeItem('logo');
  };

  const setTabColor = (tabId, color) => {
    setTabColors(prev => ({
      ...prev,
      [tabId]: color
    }));
  };

  return (
    <ThemeContext.Provider value={{ 
      primaryColor, 
      setPrimaryColor, 
      logo, 
      setLogo, 
      removeLogo,
      tabColors,
      setTabColor
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);