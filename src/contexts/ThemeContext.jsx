import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [primaryColor, setPrimaryColor] = useState(
    localStorage.getItem("primaryColor") || "#1e3a8a"
  );

  const [sidebarColor, setSidebarColor] = useState(
    localStorage.getItem("sidebarColor") || primaryColor
  );

  const [tabColor, setTabColor] = useState(
    localStorage.getItem("tabColor") || "#6b7280" 
  );

  const [logo, setLogo] = useState(localStorage.getItem("logo") || null);

  useEffect(() => {
    document.documentElement.style.setProperty("--color-primary", primaryColor);
    localStorage.setItem("primaryColor", primaryColor);
  }, [primaryColor]);

  useEffect(() => {
    localStorage.setItem("sidebarColor", sidebarColor);
  }, [sidebarColor]);

  useEffect(() => {
    localStorage.setItem("tabColor", tabColor);
  }, [tabColor]);

  useEffect(() => {
    if (logo) {
      localStorage.setItem("logo", logo);
    } else {
      localStorage.removeItem("logo");
    }
  }, [logo]);

  const removeLogo = () => {
    setLogo(null);
    localStorage.removeItem("logo");
  };

  return (
    <ThemeContext.Provider
      value={{
        primaryColor,
        setPrimaryColor,
        sidebarColor,
        setSidebarColor,
        tabColor,
        setTabColor,
        logo,
        setLogo,
        removeLogo,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
