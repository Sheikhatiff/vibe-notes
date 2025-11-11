import React from "react";

function TextAreaField({
  label = "",
  name = "",
  value = "",
  setValue,
  placeholder = "",
  rows = 5,
  required = false,
  autoFocus = false,
  disabled = false,
  css = "",
  divCss = "",
}) {
  return (
    <div
      className={`${divCss} mb-2 mt-8 flex gap-2 flex-col   
        sm:flex-row sm:items-center`}
    >
      {label && (
        <label
          htmlFor={name}
          className="sm:basis-20 uppercase tracking-wide font-medium"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <textarea
        id={name}
        name={name}
        value={value}
        onChange={(e) => setValue?.(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        autoFocus={autoFocus}
        required={required}
        disabled={disabled}
        className={`${css} w-full rounded-md border border-stone-400
              px-4 py-2 text-sm transition-all duration-300 
              placeholder:text-stone-400 focus:outline-none focus:ring
              focus:ring-emerald-400 md:px-6 md:py-3 sm:ml-6 resize-none ${
                disabled ? "bg-gray-100 cursor-not-allowed opacity-70" : ""
              }`}
      />
    </div>
  );
}

export default TextAreaField;
