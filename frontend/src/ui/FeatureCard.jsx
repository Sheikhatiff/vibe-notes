import React from "react";

function FeatureCard({ title, description, css }) {
  return (
    <div
      className={`${css} bg-stone-50 rounded-2xl shadow-md p-8 hover:shadow-lg transition-all`}
    >
      <h3 className="text-xl font-bold uppercase text-emerald-700 mb-3">
        {title}
      </h3>
      <p className="text-stone-500 text-sm italic">{description}</p>
    </div>
  );
}

export default FeatureCard;
