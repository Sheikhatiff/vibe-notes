import React from "react";

function TextField({
  label = "",
  name = "",
  value = "",
  setValue,
  type = "text",
  placeholder = "",
  required = false,
  css = "",
  divCss = "",
  disabled = false,
}) {
  return (
    <div
      className={`${divCss} mb-5 mt-2 flex gap-2 flex-col sm:flex-row sm:items-center`}
    >
      {label && (
        <label
          htmlFor={name}
          className="sm:basis-20 uppercase tracking-wide font-medium"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}{" "}
          {/* optional indicator */}
        </label>
      )}

      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        className={`${css} w-full rounded-md border border-stone-400 px-4 py-2 text-sm transition-all duration-300 placeholder:text-stone-400 focus:outline-none focus:ring focus:ring-emerald-400 md:px-6 md:py-3 sm:ml-6`}
        value={value}
        onChange={(e) => setValue?.(e.target.value)}
        required={required}
        disabled={disabled}
      />
    </div>
  );
}

export default TextField;
