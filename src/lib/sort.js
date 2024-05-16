// sort data based on given column
export function sortByColumn(data, col, order = "asc") {
  const sorted = [...data].sort((a, b) => {
    let result = compareValues(a[col], b[col]);
    if (col === "date") result = compareDates(a[col], b[col]);
    if (order !== "asc") {
      result = -result;
    }
    return result;
  });
  return sorted;
}

function compareValues(a, b) {
  if (typeof a === "string" && typeof b === "string") return a.localeCompare(b);
  return a - b;
}

function compareDates(a, b) {
  const dateA = new Date(a);
  const dateB = new Date(b);
  if (dateA < dateB) return -1;
  if (dateA > dateB) return 1;
  return 0;
}
