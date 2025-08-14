// Loader.jsx
import React from "react";

const LoadMore = ({ size = 18, color = "white" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    style={{ display: "inline-block", verticalAlign: "middle" }}
    className="animate-spin"
  >
    <circle
      cx="16"
      cy="16"
      r="14"
      stroke={color}
      strokeWidth="4"
      opacity="0.25"
    />
    <path
      d="M30 16a14 14 0 0 1-14 14"
      stroke={color}
      strokeWidth="4"
      strokeLinecap="round"
      opacity="0.85"
    />
  </svg>
);

export default LoadMore;
