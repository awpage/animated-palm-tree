export function log() {
  console.log(`
         / \\__
       (    @\\___
       /         O
      /   (_____/
     /_____/   U

Welcome to the ctrlcv! 🐾 Love this? send a shoutout here: https://twitter.com/booluw
`);
}

export function formatDate(date: Date): string {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const dayName = days[date.getDay()];
  const month = months[date.getMonth()];
  const day = date.getDate();

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${dayName}, ${month} ${day} | ${hours}:${minutes}`;
}

export function getFirstChars(str: string, x: number) {
  if (typeof str !== "string") return "";
  if (typeof x !== "number" || x < 0) return "";
  return str.slice(0, x);
}

