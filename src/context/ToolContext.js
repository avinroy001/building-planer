import { createContext, useContext, useState } from "react";

const ToolContext = createContext();

export const useTool = () => useContext(ToolContext);

export const ToolProvider = ({ children }) => {
  const [tool, setTool] = useState("select");
  const [showAnnotations, setShowAnnotations] = useState(true);

  return (
    <ToolContext.Provider value={{ tool, setTool, showAnnotations, setShowAnnotations }}>
      {children}
    </ToolContext.Provider>
  );
};
