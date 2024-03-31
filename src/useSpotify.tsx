export async function getCredentials() {
  const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
  const SECRET = import.meta.env.VITE_SECRET;

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    body:
      "grant_type=client_credentials&client_id=" +
      CLIENT_ID +
      "&client_secret=" +
      SECRET,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  const result = await response.json();
  return result;
}
