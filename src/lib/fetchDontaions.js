export async function fetchDonations(callback) {
  const data = await fetch("/donations");
  const json = await data.json();
  callback(json);
}