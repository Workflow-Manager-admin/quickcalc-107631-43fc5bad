import React, { useState } from "react";

// PUBLIC_INTERFACE
/**
 * Main Container for QuickCalc
 * A simple calculator with addition, subtraction, multiplication, division, 
 * and clear functionality.
 * 
 * UI: Compact, light-themed, responsive, single-file component.
 */
function QuickCalcContainer() {
  // Calculator state
  const [displayValue, setDisplayValue] = useState("0");
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [operator, setOperator] = useState(null);
  const [operand, setOperand] = useState(null);

  // Color palette as per design
  const COLORS = {
    primary: "#ffffff",
    secondary: "#f0f0f0",
    accent: "#007bff",
    operator: "#d0e3ff",
    buttonText: "#222",
    buttonAccent: "#fff",
  };

  // Calculator button definitions: digits, operators, controls
  const BUTTONS = [
    ["7", "8", "9", "\u00F7"],        // ÷
    ["4", "5", "6", "\u00D7"],        // ×
    ["1", "2", "3", "-"],
    ["0", ".", "C", "+"],
    ["="]
  ];

  // Helper: Is the input a digit
  const isDigit = val => /\d/.test(val);

  // Helper: Is the input an operator
  const isOp = val => ["+", "-", "\u00D7", "\u00F7"].includes(val);

  // Button click handler
  // PUBLIC_INTERFACE
  function handleButtonClick(val) {
    if (isDigit(val)) {
      if (displayValue === "0" || waitingForOperand) {
        setDisplayValue(val);
        setWaitingForOperand(false);
      } else {
        setDisplayValue(displayValue.length < 12 ? displayValue + val : displayValue);
      }
    } else if (val === ".") {
      if (!displayValue.includes(".")) {
        setDisplayValue(displayValue + ".");
        setWaitingForOperand(false);
      }
    } else if (isOp(val)) {
      handleOperator(val);
    } else if (val === "=") {
      handleEquals();
    } else if (val === "C") {
      handleClear();
    }
  }

  // PUBLIC_INTERFACE
  function handleOperator(nextOperator) {
    const inputValue = parseFloat(displayValue);

    if (operator && !waitingForOperand) {
      const result = performOperation(operand, inputValue, operator);
      setDisplayValue(String(result));
      setOperand(result);
    } else {
      setOperand(inputValue);
    }
    setOperator(nextOperator);
    setWaitingForOperand(true);
  }

  // PUBLIC_INTERFACE
  function handleEquals() {
    if (operator && operand !== null) {
      const inputValue = parseFloat(displayValue);
      const result = performOperation(operand, inputValue, operator);
      setDisplayValue(String(result));
      setOperand(null);
      setOperator(null);
      setWaitingForOperand(true);
    }
  }

  // PUBLIC_INTERFACE
  function handleClear() {
    setDisplayValue("0");
    setOperand(null);
    setOperator(null);
    setWaitingForOperand(false);
  }

  // PUBLIC_INTERFACE
  function performOperation(left, right, op) {
    switch (op) {
      case "+": return round(left + right);
      case "-": return round(left - right);
      case "\u00D7": return round(left * right);
      case "\u00F7": 
        if (right === 0) {
          return "Error";
        }
        return round(left / right);
      default: return right;
    }
  }

  // Small rounding helper to avoid floating-point issues
  function round(num) {
    if (typeof num === "number") {
      return Math.round(num * 1e10) / 1e10;
    }
    return num;
  }

  return (
    <div style={styles.calcOuter(COLORS)}>
      <div style={styles.calcContainer(COLORS)}>
        <div style={styles.display(COLORS)}>
          {displayValue}
        </div>
        <div style={styles.buttonGrid}>
          {BUTTONS.flat().map((btn, idx) => (
            <button
              key={btn + idx}
              style={getButtonStyle(btn, COLORS)}
              onClick={() => handleButtonClick(btn)}
              aria-label={getAriaLabel(btn)}
            >
              {btn}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// Style generators for each section
const styles = {
  calcOuter: theme => ({
    background: theme.secondary,
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  }),
  calcContainer: theme => ({
    background: theme.primary,
    borderRadius: 16,
    boxShadow: "0 6px 32px 0 rgba(27,56,140,0.08)",
    padding: "24px 18px 18px 18px",
    width: "100%",
    maxWidth: 340,
    minWidth: 270,
    display: "flex",
    flexDirection: "column",
    gap: 18,
  }),
  display: theme => ({
    background: theme.secondary,
    borderRadius: 12,
    minHeight: "54px",
    textAlign: "right",
    fontSize: "2.2rem",
    fontFamily: "'Menlo','Consolas','monospace'",
    color: "#16191a",
    padding: "12px",
    marginBottom: 7,
    wordBreak: "break-all",
    border: `1.5px solid ${theme.accent}20`,
    boxSizing: "border-box"
  }),
  buttonGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gridAutoRows: "46px",
    gap: "12px",
  },
  button: (theme, type) => ({
    fontSize: "1.2rem",
    fontWeight: 500,
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
    background: type === "operator" 
                ? theme.operator
                : type === "accent"
                ? theme.accent
                : theme.secondary,
    color: type === "accent" ? theme.buttonAccent : theme.buttonText,
    transition: "background 0.15s",
    boxShadow: "0 2px 8px 0 rgba(16,21,60,0.04)",
    outline: "none"
  })
};

// Determines button style type based on character
function getButtonStyle(btn, COLORS) {
  if (["+", "-", "\u00D7", "\u00F7"].includes(btn)) {
    return { ...styles.button(COLORS, "operator") };
  }
  if (btn === "=") {
    return {
      ...styles.button(COLORS, "accent"),
      gridColumn: "span 4",
      fontSize: "1.45rem",
      fontWeight: 700
    };
  }
  if (btn === "C") {
    return { ...styles.button(COLORS, "accent") };
  }
  return styles.button(COLORS, "number");
}

// Improve accessibility for screen readers
function getAriaLabel(btn) {
  switch (btn) {
    case "\u00F7": return "divide";
    case "\u00D7": return "multiply";
    case "+": return "add";
    case "-": return "subtract";
    case "=": return "equals";
    case "C": return "clear";
    default: return btn;
  }
}

export default QuickCalcContainer;
