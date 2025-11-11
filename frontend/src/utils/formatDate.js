export const formatDate = (mongoDate, options = {}) => {
  if (!mongoDate) return "";

  try {
    const date = new Date(mongoDate);
    // default: "Oct 31, 2025, 9:32 PM"
    const defaultOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    };

    return date.toLocaleString("en-US", { ...defaultOptions, ...options });
  } catch (e) {
    console.error("Invalid date:", mongoDate, e);
    return "";
  }
};
