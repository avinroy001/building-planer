import { useTool } from "../context/ToolContext";

const Toolbar = () => {
  const { tool, setTool, showAnnotations, setShowAnnotations } = useTool();

  return (
    <div className="toolbar">
      <button onClick={() => setTool("select")} className={tool === "select" ? "active" : ""}>Select</button>
      <button onClick={() => setTool("line")} className={tool === "line" ? "active" : ""}>Line</button>
      <button onClick={() => setTool("rectangle")} className={tool === "rectangle" ? "active" : ""}>Rectangle</button>
      <button onClick={() => setTool("circle")} className={tool === "circle" ? "active" : ""}>Circle</button>
      <button onClick={() => setShowAnnotations(!showAnnotations)}>
        {showAnnotations ? "Hide" : "Show"} Annotations
      </button>
    </div>
  );
};

export default Toolbar;