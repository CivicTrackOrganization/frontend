import { format, parseISO } from "date-fns";

export const displayIsoString = (isoString: string) => {
  const date = parseISO(isoString);
  return format(date, "d MMMM yyyy HH:mm");
};

export const displayDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return format(date, "d MMMM yyyy");
};
