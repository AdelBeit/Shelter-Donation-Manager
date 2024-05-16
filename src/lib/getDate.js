// format date to yyyy-mm-dd
export function getDate(d) {
  if (!d) {
    d = new Date();
  }
  return new Date(d).toISOString().slice(0, 10);
}
