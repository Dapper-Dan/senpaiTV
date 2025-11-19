import { NextRequest, NextResponse } from "next/server";
import { exchangeCodeForToken } from "@/lib/aniList/oauth/oauth";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");

  if (error) {
    return NextResponse.redirect(
      new URL(`/?anilist_error=${encodeURIComponent(error === 'access_denied' ? 'Authorization was cancelled' : error)}`, req.url)
    );
  }

  if (!code) {
    return NextResponse.redirect(
      new URL('/?anilist_error=No authorization code received', req.url)
    );
  }

  try {
    const tokenData = await exchangeCodeForToken(code);
    const redirectUrl = new URL('/anilist/callback', req.url);
    redirectUrl.hash = `#token=${tokenData.access_token}`;
    
    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    return NextResponse.redirect(
      new URL(`/?anilist_error=${encodeURIComponent(error instanceof Error ? error.message : 'Failed to connect AniList')}`, req.url)
    );
  }
}
