export default function Tag({ tag, css }) {
  return (
    <span
      className={`${css} text-xs font-semibold lowercase text-emerald-600 whitespace-nowrap`}
    >
      #{tag}
    </span>
  );
}
