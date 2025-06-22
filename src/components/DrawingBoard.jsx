import { useEffect, useRef, useState } from "react";
import { useTool } from "../context/ToolContext";
import "./DrawingBoard.css";

const DrawingBoard = () => {
  const canvasRef = useRef(null);
  const { tool, showAnnotations } = useTool();
  const [drawnShapes, setDrawnShapes] = useState([]);
  const [startPoint, setStartPoint] = useState(null);
  const [selectedShape, setSelectedShape] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);

  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.focus();
    }
  }, []);

  const handleDeleteShape = () => {
    if (selectedShape !== null) {
      setDrawnShapes((prev) => prev.filter((_, i) => i !== selectedShape));
      setSelectedShape(null);
    }
  };

  const handleDeleteKeyDown = (e) => {
    if (e.key === "Delete") {
      e.preventDefault();
      handleDeleteShape();
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawnShapes.forEach((shape, index) => {
      ctx.beginPath();
      if (shape.type === "line") {
        ctx.moveTo(shape.start.x, shape.start.y);
        ctx.lineTo(shape.end.x, shape.end.y);

        if (showAnnotations) {
          const dx = shape.end.x - shape.start.x;
          const dy = shape.end.y - shape.start.y;
          const length = Math.round(Math.hypot(dx, dy));

          const midX = (shape.start.x + shape.end.x) / 2;
          const midY = (shape.start.y + shape.end.y) / 2;

          ctx.font = "12px Arial";
          ctx.fillStyle = "black";
          ctx.fillText(`L=${length}`, midX + 5, midY - 5);
        }
      } else if (shape.type === "rectangle") {
        const width = shape.end.x - shape.start.x;
        const height = shape.end.y - shape.start.y;
        ctx.rect(shape.start.x, shape.start.y, width, height);
        if (showAnnotations) {
          ctx.font = "12px Arial";
          ctx.fillText(
            `${Math.abs(width)} x ${Math.abs(height)}`,
            shape.start.x + 5,
            shape.start.y - 5
          );
        }
      } else if (shape.type === "circle") {
        const radius = Math.hypot(
          shape.end.x - shape.start.x,
          shape.end.y - shape.start.y
        );
        ctx.arc(shape.start.x, shape.start.y, radius, 0, Math.PI * 2);
        if (showAnnotations) {
          ctx.font = "12px Arial";
          ctx.fillText(
            `r=${Math.round(radius)}`,
            shape.start.x + 5,
            shape.start.y - 5
          );
        }
      }

      ctx.strokeStyle = index === selectedShape ? "red" : "black";
      ctx.lineWidth = index === selectedShape ? 3 : 1;
      ctx.stroke();

      if (index === selectedShape) {
        ctx.fillStyle = "blue";
        const resizeHandlePos = getShapeBottomRight(shape);
        ctx.fillRect(resizeHandlePos.x - 4, resizeHandlePos.y - 4, 8, 8);
      }
    });
  }, [drawnShapes, showAnnotations, selectedShape]);

  const getCanvasCoordinates = (event) => {
    const canvasRect = canvasRef.current.getBoundingClientRect();
    return {
      x: event.clientX - canvasRect.left,
      y: event.clientY - canvasRect.top,
    };
  };

  const getShapeBottomRight = (shape) => {
    if (shape.type === "circle") {
      const radius = Math.hypot(
        shape.end.x - shape.start.x,
        shape.end.y - shape.start.y
      );
      return { x: shape.start.x + radius, y: shape.start.y + radius };
    } else if (shape.type === "rectangle") {
      return {
        x: Math.max(shape.start.x, shape.end.x),
        y: Math.max(shape.start.y, shape.end.y),
      };
    }
    return { x: shape.end.x, y: shape.end.y };
  };

  const isPointNearResizeHandle = (point, shape) => {
    const handleSize = 8;
    const handleLocation = getShapeBottomRight(shape);
    return (
      Math.abs(point.x - handleLocation.x) < handleSize &&
      Math.abs(point.y - handleLocation.y) < handleSize
    );
  };

  const isPointWithinShape = (point, shape) => {
    const hitTolerance = 5;
    const ctx = canvasRef.current.getContext("2d");
    ctx.beginPath();

    if (shape.type === "line") {
      const dx = shape.end.x - shape.start.x;
      const dy = shape.end.y - shape.start.y;
      const lineLengthSq = dx * dx + dy * dy;

      if (lineLengthSq === 0) {
        return (
          Math.hypot(point.x - shape.start.x, point.y - shape.start.y) <
          hitTolerance
        );
      }

      const t =
        ((point.x - shape.start.x) * dx + (point.y - shape.start.y) * dy) /
        lineLengthSq;
      const closestX = shape.start.x + dx * Math.max(0, Math.min(1, t));
      const closestY = shape.start.y + dy * Math.max(0, Math.min(1, t));

      return Math.hypot(point.x - closestX, point.y - closestY) < hitTolerance;
    } else if (shape.type === "rectangle") {
      const xMin = Math.min(shape.start.x, shape.end.x);
      const xMax = Math.max(shape.start.x, shape.end.x);
      const yMin = Math.min(shape.start.y, shape.end.y);
      const yMax = Math.max(shape.start.y, shape.end.y);
      return (
        point.x >= xMin && point.x <= xMax && point.y >= yMin && point.y <= yMax
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
      return Math.abs(distance - radius) < hitTolerance;
    }
    return false;
  };

  const handleMouseDown = (e) => {
    const currentMousePoint = getCanvasCoordinates(e);
    setStartPoint(currentMousePoint);

    if (tool === "select") {
      const clickedShapeIndex = drawnShapes.findIndex((shape) =>
        isPointWithinShape(currentMousePoint, shape)
      );

      if (clickedShapeIndex !== -1) {
        const clickedShape = drawnShapes[clickedShapeIndex];

        // Check resize handle BEFORE deselecting
        if (isPointNearResizeHandle(currentMousePoint, clickedShape)) {
          setSelectedShape(clickedShapeIndex);
          setIsResizing(true);
        } else {
          setSelectedShape(clickedShapeIndex);
          setIsDragging(true);
        }
      } else {
        // Don't deselect if you're clicking near the resize handle of selected shape
        if (
          selectedShape !== null &&
          isPointNearResizeHandle(currentMousePoint, drawnShapes[selectedShape])
        ) {
          setIsResizing(true);
        } else {
          setSelectedShape(null);
        }
      }
    }
  };

  const handleMouseMove = (e) => {
    const currentMousePoint = getCanvasCoordinates(e);

    if (isDragging && selectedShape !== null) {
      const deltaX = currentMousePoint.x - startPoint.x;
      const deltaY = currentMousePoint.y - startPoint.y;

      setDrawnShapes((prevShapes) =>
        prevShapes.map((shape, index) =>
          index === selectedShape
            ? {
                ...shape,
                start: { x: shape.start.x + deltaX, y: shape.start.y + deltaY },
                end: { x: shape.end.x + deltaX, y: shape.end.y + deltaY },
              }
            : shape
        )
      );
      setStartPoint(currentMousePoint);
    }

    if (isResizing && selectedShape !== null) {
      setDrawnShapes((prevShapes) =>
        prevShapes.map((shape, index) =>
          index === selectedShape
            ? {
                ...shape,
                end: currentMousePoint, // works for both circle and rectangle
              }
            : shape
        )
      );
    }
  };

  const handleMouseUp = (e) => {
    if (startPoint && tool !== "select" && !isDragging && !isResizing) {
      const endPoint = getCanvasCoordinates(e);
      setDrawnShapes((prev) => [
        ...prev,
        { type: tool, start: startPoint, end: endPoint },
      ]);
    }
    setIsDragging(false);
    setIsResizing(false);
    setStartPoint(null);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    setIsResizing(false);
    setStartPoint(null);
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        tabIndex={0}
        onKeyDown={handleDeleteKeyDown}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        style={{
          border: "1px solid gray",
          background: "white",
          outline: "none",
          cursor:
            tool === "select"
              ? isResizing
                ? "se-resize"
                : "pointer"
              : "crosshair",
        }}
      />
      {selectedShape !== null && (
        <button onClick={handleDeleteShape} style={{ marginTop: 10 }}>
          Delete Selected Shape
        </button>
      )}
    </div>
  );
};

export default DrawingBoard;
