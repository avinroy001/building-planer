import { useTool } from "../context/ToolContext";

const Toolbar = () => {
  const { tool, setTool, showAnnotations, setShowAnnotations } = useTool();

  return (
    <div className="toolbar">
      <button onClick={() => setTool("select")}>Select</button>
      <button onClick={() => setTool("line")}>Line</button>
      <button onClick={() => setTool("rectangle")}>Rectangle</button>
      <button onClick={() => setTool("circle")}>Circle</button>
      <button onClick={() => setShowAnnotations(!showAnnotations)}>
        {showAnnotations ? "Hide" : "Show"} Annotations
      </button>
    </div>
  );
};

export default Toolbar;
