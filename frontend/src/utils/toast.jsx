import toast from "react-hot-toast";

export const showSuccess = (msg) =>
  toast.success(msg, {
    icon: "✅",
  });

export const showError = (msg) =>
  toast.error(msg, {
    icon: "❌",
  });
export const showInfo = (msg) =>
  toast.success(msg, {
    icon: "ℹ",
  });

export const showConfirm = (msg, onConfirm) => {
  toast.custom((t) => (
    <div
      className={`bg-gray-800 text-white rounded-2xl shadow-xl p-5 flex flex-col gap-3
      w-[90%] sm:w-[70%] md:w-[50%] lg:w-[30%] mx-auto text-center`}
    >
      <p className="text-lg font-medium">{msg}</p>
      <div className="flex justify-center gap-3">
        <button
          onClick={() => {
            toast.dismiss(t.id);
            onConfirm?.();
          }}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-1.5 rounded-lg"
        >
          Yes
        </button>
        <button
          onClick={() => toast.dismiss(t.id)}
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-1.5 rounded-lg"
        >
          No
        </button>
      </div>
    </div>
  ));
};
