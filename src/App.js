import Toolbar from "./components/Toolbar";
import DrawingBoard from "./components/DrawingBoard";
import { ToolProvider } from "./context/ToolContext";

function App() {
  return (
    <ToolProvider>
      <div className="app">
        <Toolbar />
        <DrawingBoard />
      </div>
    </ToolProvider>
  );
}

export default App;
