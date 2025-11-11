import React from "react";
import { FadeLoader } from "react-spinners";

function Loader({ color }) {
  return (
    <div className="absolute inset-0 bg-slate-200/20 backdrop-blur-sm flex items-center justify-center">
      <FadeLoader color={color} />
    </div>
  );
}

export default Loader;
