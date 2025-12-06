import React from "react";

function Loader({ color, fullScreen = true, size = "md" }) {
  const sizeClasses = {
    sm: "h-8 w-8 border-b-2",
    md: "h-12 w-12 border-b-2",
    lg: "h-16 w-16 border-b-4",
  };

  const spinnerClass = `animate-spin rounded-full border-emerald-900 ${
    sizeClasses[size] || sizeClasses.md
  }`;

  if (fullScreen) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className={spinnerClass}></div>
      </div>
    );
  }

  // Inline loader for component-level loading
  return (
    <div className="flex items-center justify-center py-4">
      <div className={spinnerClass}></div>
    </div>
  );
}

export default Loader;
