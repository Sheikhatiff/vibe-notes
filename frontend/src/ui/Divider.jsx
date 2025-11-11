export default function Divider() {
  return (
    <div className="flex items-center justify-center my-3">
      <div className="grow h-px bg-gray-300"></div>
      <span className="mx-3 text-gray-500 text-sm font-medium">or</span>
      <div className="grow h-px bg-gray-300"></div>
    </div>
  );
}
