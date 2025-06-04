import { NextRequest, NextResponse } from "next/server";
import { exchangeCodeForToken } from "@/lib/aniList/oauth";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "No code in callback" }, { status: 400 });
  }

  try {
    const tokenData = await exchangeCodeForToken(code);
    return NextResponse.json({ 
      success: true,
      access_token: tokenData.access_token,
      token_type: tokenData.token_type,
      expires_in: tokenData.expires_in
    });
  } catch (error) {
    return NextResponse.json({ 
      error: "Failed to exchange code for token",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
