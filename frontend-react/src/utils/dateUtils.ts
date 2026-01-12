import { format, isValid, parseISO } from "date-fns";

export const displayIsoString = (isoString: string) => {
  const date = parseISO(isoString);
  if (!isValid(date)) return "-";
  return format(date, "d MMMM yyyy HH:mm");
};

export const displayDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return format(date, "d MMMM yyyy");
};
