import dotenv from 'dotenv';

dotenv.config();

const ANILIST_AUTH_URL = 'https://anilist.co/api/v2/oauth/authorize';
const ANILIST_TOKEN_URL = 'https://anilist.co/api/v2/oauth/token';

const CLIENT_ID = process.env.NEXT_PUBLIC_ANI_CLIENT_ID!;
const CLIENT_SECRET = process.env.ANI_CLIENT_SECRET!;
const REDIRECT_URI = process.env.NEXT_PUBLIC_ANI_REDIRECT_URI!;

export function getAniListAuthUrl() {
  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: 'code',
  });
  return `${ANILIST_AUTH_URL}?${params.toString()}`;
}

export async function exchangeCodeForToken(code: string) {
  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    redirect_uri: REDIRECT_URI,
    code,
  });

  const response = await fetch(ANILIST_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json'
    },
    body: params.toString()
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Full error response:', errorText);
    throw new Error(`Token exchange failed: ${response.status} - ${errorText}`);
  }
  
  return response.json();
}
