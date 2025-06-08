import dotenv from "dotenv";
dotenv.config();

const MAL_AUTH_URL = "https://myanimelist.net/v1/oauth2/authorize";
const MAL_TOKEN_URL = "https://myanimelist.net/v1/oauth2/token";

const CLIENT_ID = process.env.MAL_CLIENT_ID!;
const CLIENT_SECRET = process.env.MAL_CLIENT_SECRET!;
const REDIRECT_URI = process.env.MAL_REDIRECT_URI!;

// PKCE: code_challenge
function generateCodeVerifier(length = 64) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function getMalAuthUrl(state: string, codeVerifier: string) {
  const params = new URLSearchParams({
    response_type: "code",
    client_id: CLIENT_ID,
    state,
    redirect_uri: REDIRECT_URI,
    code_challenge: codeVerifier,
    code_challenge_method: "plain",
  });
  return `${MAL_AUTH_URL}?${params.toString()}`;
}

export async function exchangeMalCodeForToken(code: string, codeVerifier: string) {
  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    grant_type: "authorization_code",
    code,
    redirect_uri: REDIRECT_URI,
    code_verifier: codeVerifier,
  });
  const res = await fetch(MAL_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });
  if (!res.ok) throw new Error(`Token exchange failed: ${res.status}`);
  return res.json();
}

export { generateCodeVerifier };
