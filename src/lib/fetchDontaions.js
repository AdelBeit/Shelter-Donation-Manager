export async function fetchDonations(callback) {
  const res = await fetch("/donations");
  const data = await res.json();
  callback(data);
}