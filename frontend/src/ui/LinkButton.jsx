import React from "react";
import { Link } from "react-router-dom";

function LinkButton({
  children,
  to,
  css = "",
  type = "submit",
  disable = false,
  onClick = () => {},
}) {
  const handleDisabled = (e) => {
    if (disable) e.preventDefault();
  };
  const className = `${css} bg-emerald-700 hover:bg-emerald-900 uppercase transition-colors duration-300 border-b p-2 px-4 rounded-full focus:bg-emerald-900 focus:outline-none 
  focus:ring focus:ring-emerald-900 focus:ring-offset-4 text-stone-100 tracking-widest disabled:cursor-not-allowed`;
  if (type === "link" && to) {
    return (
      <Link
        to={to}
        onClick={handleDisabled}
        className={`${css} text-emerald-400 font-semibold hover:underline hover:text-emerald-700`}
      >
        {children}
      </Link>
    );
  }
  if (to) {
    return (
      <Link to={to} onClick={handleDisabled} className={className}>
        {children}
      </Link>
    );
  }
  return (
    <button
      onClick={onClick}
      type={type}
      disabled={disable}
      className={className}
    >
      {children}
    </button>
  );
}

export default LinkButton;
