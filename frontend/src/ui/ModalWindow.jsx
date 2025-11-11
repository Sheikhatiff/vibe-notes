import React from "react";

function ModalWindow({
  title = "Confirm Action",
  descr = " Are you sure you want to proceed with this operation?",
  setIsOpen,
  onConfirm,
}) {
  return (
    <div className="absolute  inset-0 bg-slate-200/20 backdrop-blur-sm flex items-center justify-center">
      <div className="p-6 text-center ">
        <h2 className="text-xl font-bold uppercase text-gray-800 mb-2">
          {title}
        </h2>
        <p className="text-gray-600 mb-6">{descr}</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 rounded-lg bg-emerald-200 hover:bg-emerald-300 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-700 text-white transition"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalWindow;
