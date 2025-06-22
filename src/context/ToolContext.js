import { createContext, useContext, useState } from "react";

const ToolContext = createContext();

export const useTool = () => useContext(ToolContext);

export const ToolProvider = ({ children }) => {
  const [activeTool, setActiveTool] = useState("select");
  const [areAnnotationsVisible, setAreAnnotationsVisible] = useState(true);

  const contextValue = {
    tool: activeTool,
    setTool: setActiveTool,
    showAnnotations: areAnnotationsVisible,
    setShowAnnotations: setAreAnnotationsVisible,
  };

  return (
    <ToolContext.Provider value={contextValue}>
      {children}
    </ToolContext.Provider>
  );
};