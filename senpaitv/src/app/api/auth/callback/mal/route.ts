import { NextRequest, NextResponse } from "next/server";
import { exchangeMalCodeForToken } from "@/lib/mal/oauth/oauth";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const codeVerifier = url.searchParams.get("code_verifier");

  if (!code) {
    return NextResponse.json({ error: "No code in callback" }, { status: 400 });
  }
  if (!codeVerifier) {
    return NextResponse.json({ error: "No code_verifier in callback" }, { status: 400 });
  }

  try {
    const tokenData = await exchangeMalCodeForToken(code, codeVerifier);
    return NextResponse.json({
      success: true,
      ...tokenData
    });
  } catch (error) {
    return NextResponse.json({
      error: "Failed to exchange code for token",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
