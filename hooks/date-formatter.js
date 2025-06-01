import { format, isToday, isYesterday, isThisWeek } from "date-fns";

// ===== FORMAT RELATIVE DATE =====
const formatRelativeDate = (date) => {
  if (isToday(date)) {
    return format(date, "hh:mm a"); // e.g., 12:14 PM
  } else if (isYesterday(date)) {
    return "Yesterday";
  } else if (isThisWeek(date)) {
    return format(date, "EEEE"); // e.g., Monday, Tuesday, etc.
  } else {
    return format(date, "dd/MM/yyyy"); // e.g., 14/04/2025
  }
};

export { formatRelativeDate };
