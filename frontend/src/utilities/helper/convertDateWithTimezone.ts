const pad = (num: number): string => num.toString().padStart(2, "0");
const padMs = (num: number): string => num.toString().padStart(3, "0");

export function convertDateWithTimezone<
  T extends { date: string | number | Date }
>(obj: T): T {
  const d = new Date(obj.date);
  const offsetInMinutes = -d.getTimezoneOffset();
  const offsetHours = Math.floor(Math.abs(offsetInMinutes) / 60);
  const offsetMinutes = Math.abs(offsetInMinutes) % 60;
  const offsetSign = offsetInMinutes >= 0 ? "+" : "-";
  const formattedDate = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
    d.getDate()
  )}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}.${padMs(
    d.getMilliseconds()
  )}${offsetSign}${pad(offsetHours)}:${pad(offsetMinutes)}`;
  return { ...obj, date: formattedDate };
}

export function convertDatesWithTimezoneArray<
  T extends { date: string | number | Date }
>(arr: T[]): T[] {
  return arr.map(convertDateWithTimezone);
}
