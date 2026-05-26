export function toDateOnly(value: string | Date): string {
  const date = typeof value === "string" ? new Date(value) : value;
  return date.toISOString().split("T")[0];
}

export function addRevisionYear(releaseDate: string): string {
  const date = new Date(releaseDate);
  date.setFullYear(date.getFullYear() + 1);
  return toDateOnly(date);
}

export function isTodayOrFuture(value: string): boolean {
  const input = new Date(value);
  const today = new Date();
  input.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  return input >= today;
}

export function formatDisplayDate(value: string): string {
  const [year, month, day] = value.split("T")[0].split("-");
  if (!year || !month || !day) return value;
  return `${day}/${month}/${year}`;
}
