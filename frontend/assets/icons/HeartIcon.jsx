import React from "react";

/**
 * HeartIcon
 * Props:
 *  - color: string (any valid CSS color). Use "transparent" for a transparent fill.
 *  - size: number (pixels) default 24
 *  - filled: boolean (true => filled heart, false => outline)
 *  - strokeWidth: number (for outline) default 2
 *  - className: string (optional additional classes)
 */

export default function HeartIcon({
  color = "red",
  size = 24,
  filled = true,
  strokeColor = "red",
  strokeWidth = 2,
  className = "",
  title = "favourite",
  handleClick = () => {
    console.log("heart clicked");
  },
}) {
  // If user passes "transparent" and wants an outlined heart, use currentColor for stroke
  const isTransparentFill = color === "transparent";

  return (
    <div className="flex items-end-safe">
      <svg
        onClick={handleClick}
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        aria-labelledby="heartTitle"
        role="img"
        className={className}
        style={isTransparentFill ? { color: strokeColor } : undefined}
      >
        <title id="heartTitle">{title}</title>

        {filled ? (
          <path
            d="M12 21s-7.448-4.873-10-8.072C-0.125 8.592 3.02 4 7.5 6.2 9.5 7.4 11 9 12 10.5c1-1.5 2.5-3.1 4.5-4.3C20.98 4 24.125 8.592 22 12.928 19.448 16.127 12 21 12 21z"
            fill={color}
            stroke={isTransparentFill ? strokeColor : "none"}
            strokeWidth={isTransparentFill ? strokeWidth : 0}
            strokeLinejoin="round"
          />
        ) : (
          <path
            d="M20.84 4.61c-1.54-1.33-3.78-1.33-5.32 0L12 8.09 8.48 4.61C6.94 3.28 4.7 3.28 3.16 4.61 1.07 6.17 1.07 8.9 3.16 10.47L12 19.35l8.84-8.88c2.09-1.57 2.09-4.3 0-5.86z"
            fill="none"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </svg>
      {!isTransparentFill && (
        <p className="text-xs text-stone-400">favourite</p>
      )}
    </div>
  );
}
