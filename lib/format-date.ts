import { format as dfFormat } from "date-fns";

/**
 * Format a date value consistently across the app.
 * Accepts Date | string | number and returns formatted string.
 * Default format: "MMM dd, yyyy • hh:mm a"
 */
export function formatDate(
  value: Date | string | number | undefined | null,
  pattern = "MMM dd, yyyy • hh:mm a",
): string {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  try {
    return dfFormat(date, pattern);
  } catch (e) {
    return date.toLocaleString();
  }
}

export default formatDate;
