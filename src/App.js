import React, { useState, useEffect } from "react";

const App = () => {
  const [selectedCells, setSelectedCells] = useState([]);
  const [highlightedPoints, setHighlightedPoints] = useState([]); // Initially set to some default points or empty array

  const handleCellClick = (row, col) => {
    setSelectedCells((prev) => {
      if (prev.some((cell) => cell[0] === row && cell[1] === col)) {
        return prev.filter((cell) => cell[0] !== row || cell[1] !== col);
      } else if (prev.length < 2) {
        return [...prev, [row, col]];
      }
      return prev;
    });
  };

  const resetSelection = () => {
    setSelectedCells([]);
    setHighlightedPoints([]); // Reset the highlighted points when selection is reset
  };

  const isCellSelected = (row, col) => {
    return selectedCells.some((cell) => cell[0] === row && cell[1] === col);
  };

  const isCellHighlighted = (row, col) => {
    return highlightedPoints.some(
      (point) => point[0] === row && point[1] === col
    );
  };

  const getCellStyle = (row, col) => {
    const baseStyle = {
      width: "40px",
      height: "40px",
      border: "1px solid #ccc",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      fontSize: "12px",
    };

    if (isCellSelected(row, col)) {
      return { ...baseStyle, backgroundColor: "#3b82f6", color: "white" };
    }
    if (isCellHighlighted(row, col)) {
      return { ...baseStyle, backgroundColor: "#fde047" };
    }
    return baseStyle;
  };

  const renderGrid = () => {
    const cells = [];
    for (let i = 0; i < 20; i++) {
      for (let j = 0; j < 20; j++) {
        cells.push(
          <div
            key={`${i}-${j}`}
            style={getCellStyle(i, j)}
            onClick={() => handleCellClick(i, j)}
          >
            {i},{j}
          </div>
        );
      }
    }
    return cells;
  };

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(20, 40px)",
    gap: "0px",
    marginBottom: "16px",
  };

  const buttonStyle = {
    backgroundColor: "#3b82f6",
    color: "white",
    fontWeight: "bold",
    padding: "8px 16px",
    borderRadius: "4px",
    border: "none",
    cursor: "pointer",
  };

  // Function to make the API call when two cells are selected
  useEffect(() => {
    if (selectedCells.length === 2) {
      const [x1, y1] = selectedCells[0];
      const [x2, y2] = selectedCells[1];

      const payload = {
        x1,
        y1,
        x2,
        y2,
      };

      fetch("http://localhost:8080/get-path", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data && data.model) {
            setHighlightedPoints(data.model);
          } else {
            console.error("Invalid response format", data);
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    } else {
      setHighlightedPoints([]);
    }
  }, [selectedCells]);

  return (
    <div style={{ padding: "16px" }}>
      <div style={gridStyle}>{renderGrid()}</div>
      <div style={{ marginBottom: "16px" }}>
        Selected cells:
        {selectedCells.map((cell, index) => (
          <span key={index} style={{ marginLeft: "8px" }}>
            ({cell[0]}, {cell[1]})
          </span>
        ))}
      </div>
      <button onClick={resetSelection} style={buttonStyle}>
        Reset Selection
      </button>
    </div>
  );
};

export default App;
