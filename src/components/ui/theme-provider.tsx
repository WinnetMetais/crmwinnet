import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: "light",
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "light",
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove qualquer classe dark
    root.classList.remove("dark");
    root.classList.add("light");
    
    // FORÇA FUNDO BRANCO AGRESSIVAMENTE
    root.style.setProperty('background', 'white', 'important');
    root.style.setProperty('background-color', 'white', 'important');
    document.body.style.setProperty('background', 'white', 'important');
    document.body.style.setProperty('background-color', 'white', 'important');
    
    // Remove qualquer variável CSS que possa estar causando o amarelo
    root.style.removeProperty('--tw-bg-opacity');
    root.style.removeProperty('--tw-text-opacity');
    
    // Força as variáveis CSS para branco
    root.style.setProperty('--background', '255 255 255');
    root.style.setProperty('--card', '255 255 255');
    root.style.setProperty('--popover', '255 255 255');
    
  }, [theme]);

  const value = {
    theme: "light" as Theme,
    setTheme: () => {
      // Always keep light theme and white background
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      <div style={{backgroundColor: 'white'}}>
        {children}
      </div>
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
