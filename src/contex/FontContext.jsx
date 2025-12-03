import { useContext, useState, createContext } from "react";

const FontSizeContext = createContext();

export const FontSizeProvider = ({ children }) => {
  const [fontSize, setFontSize] = useState("Medium");

  const fontSizeClass = {
    Small: "text-sm",
    Medium: "text-base",
    Large: "text-xl",
  };

  return (
    <FontSizeContext.Provider value={{ fontSize, setFontSize, fontSizeClass }}>
      {children}
    </FontSizeContext.Provider>
  );
};

export const useFontSize = () => useContext(FontSizeContext);
