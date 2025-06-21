import { useEffect, useRef, useState } from "react";
import { useTool } from "../context/ToolContext";

const DrawingBoard = () => {
  const canvasRef = useRef(null);
  const { tool, showAnnotations } = useTool();
  const [shapes, setShapes] = useState([]);
  const [start, setStart] = useState(null);
  const [selectedShapeIndex, setSelectedShapeIndex] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [resizing, setResizing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    shapes.forEach((shape, index) => {
      ctx.beginPath();
      if (shape.type === "line") {
        ctx.moveTo(shape.start.x, shape.start.y);
        ctx.lineTo(shape.end.x, shape.end.y);
      } else if (shape.type === "rectangle") {
        const width = shape.end.x - shape.start.x;
        const height = shape.end.y - shape.start.y;
        ctx.rect(shape.start.x, shape.start.y, width, height);
        if (showAnnotations) {
          ctx.font = "12px Arial";
          ctx.fillText(`${Math.abs(width)} x ${Math.abs(height)}`, shape.start.x + 5, shape.start.y - 5);
        }
      } else if (shape.type === "circle") {
        const radius = Math.hypot(shape.end.x - shape.start.x, shape.end.y - shape.start.y);
        ctx.arc(shape.start.x, shape.start.y, radius, 0, Math.PI * 2);
        if (showAnnotations) {
          ctx.font = "12px Arial";
          ctx.fillText(`r=${Math.round(radius)}`, shape.start.x + 5, shape.start.y - 5);
        }
      }

      // Highlight selected shape
      ctx.strokeStyle = index === selectedShapeIndex ? "red" : "black";
      ctx.lineWidth = index === selectedShapeIndex ? 3 : 1;

      ctx.stroke();

      // Draw resize handle for selected shape
      if (index === selectedShapeIndex) {
        ctx.fillStyle = "blue";
        const br = getBottomRight(shape);
        ctx.fillRect(br.x - 4, br.y - 4, 8, 8); // small square handle
      }
    });
  }, [shapes, showAnnotations, selectedShapeIndex]);

  const getCanvasPoint = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const handleMouseDown = (e) => {
    const point = getCanvasPoint(e);

    if (tool === "select") {
      const clickedIndex = shapes.findIndex(shape => isPointInShape(point, shape));
      if (clickedIndex >= 0) {
        const shape = shapes[clickedIndex];
        if (isNearResizeHandle(point, shape)) {
          setResizing(true);
        } else {
          setDragging(true);
        }
        setSelectedShapeIndex(clickedIndex);
        setStart(point);
      } else {
        setSelectedShapeIndex(null);
      }
    } else if (tool !== "select") {
      setStart(point);
    }
  };

  const handleMouseMove = (e) => {
    const point = getCanvasPoint(e);

    if (dragging && selectedShapeIndex !== null) {
      const dx = point.x - start.x;
      const dy = point.y - start.y;

      setShapes(prev =>
        prev.map((shape, i) =>
          i === selectedShapeIndex
            ? {
                ...shape,
                start: { x: shape.start.x + dx, y: shape.start.y + dy },
                end: { x: shape.end.x + dx, y: shape.end.y + dy }
              }
            : shape
        )
      );

      setStart(point);
    }

    if (resizing && selectedShapeIndex !== null) {
      setShapes(prev =>
        prev.map((shape, i) =>
          i === selectedShapeIndex ? { ...shape, end: point } : shape
        )
      );
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
    setResizing(false);
  };

  const getBottomRight = (shape) => {
    if (shape.type === "rectangle") {
      return { x: shape.end.x, y: shape.end.y };
    } else if (shape.type === "circle") {
      const radius = Math.hypot(shape.end.x - shape.start.x, shape.end.y - shape.start.y);
      return { x: shape.start.x + radius, y: shape.start.y + radius };
    } else if (shape.type === "line") {
      return { x: shape.end.x, y: shape.end.y };
    }
    return { x: 0, y: 0 };
  };

  const isNearResizeHandle = (point, shape) => {
    const size = 8;
    const br = getBottomRight(shape);
    return Math.abs(point.x - br.x) < size && Math.abs(point.y - br.y) < size;
  };

  const isPointInShape = (point, shape) => {
    const tolerance = 5;
    const ctx = canvasRef.current.getContext("2d");

    ctx.beginPath();
    if (shape.type === "line") {
      const dx = shape.end.x - shape.start.x;
      const dy = shape.end.y - shape.start.y;
      const length = Math.sqrt(dx * dx + dy * dy);
      const percent =
        ((point.x - shape.start.x) * dx + (point.y - shape.start.y) * dy) /
        (length * length);
      const closestX = shape.start.x + dx * percent;
      const closestY = shape.start.y + dy * percent;
      const distance = Math.sqrt(
        (point.x - closestX) ** 2 + (point.y - closestY) ** 2
      );
      return distance < tolerance;
    } else if (shape.type === "rectangle") {
      const xMin = Math.min(shape.start.x, shape.end.x);
      const xMax = Math.max(shape.start.x, shape.end.x);
      const yMin = Math.min(shape.start.y, shape.end.y);
      const yMax = Math.max(shape.start.y, shape.end.y);
      return (
        point.x >= xMin &&
        point.x <= xMax &&
        point.y >= yMin &&
        point.y <= yMax
      );
    } else if (shape.type === "circle") {
      const radius = Math.hypot(
        shape.end.x - shape.start.x,
        shape.end.y - shape.start.y
      );
      const distance = Math.hypot(
        point.x - shape.start.x,
        point.y - shape.start.y
      );
      return Math.abs(distance - radius) < tolerance;
    }
    return false;
  };

  // Keyboard support: delete selected shape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Delete" && selectedShapeIndex !== null) {
        e.preventDefault();
        setShapes((prev) =>
          prev.filter((_, i) => i !== selectedShapeIndex)
        );
        setSelectedShapeIndex(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedShapeIndex]);

  // Draw on mouse up
  const handleMouseUpDraw = (e) => {
    if (!start || tool === "select") return;
    const point = getCanvasPoint(e);
    setShapes((prev) => [...prev, { type: tool, start, end: point }]);
    setStart(null);
  };

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={600}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onClick={tool !== "select" ? handleMouseUpDraw : undefined}
      style={{
        border: "1px solid gray",
        background: "white",
        cursor:
          tool === "select"
            ? resizing
              ? "se-resize"
              : "pointer"
            : "crosshair"
      }}
    />
  );
};

export default DrawingBoard;