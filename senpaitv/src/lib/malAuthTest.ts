import readline from "readline";
import { generateCodeVerifier, getMalAuthUrl, exchangeMalCodeForToken } from "./malAuth.js";

async function testMalAuth() {
  const state = Math.random().toString(36).slice(2);
  const codeVerifier = generateCodeVerifier();

  const authUrl = getMalAuthUrl(state, codeVerifier);
  console.log("\nGo to this URL in your browser to authorize:");
  console.log(authUrl);

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  rl.question("\nPaste the ?code=... value from the redirect URL here: ", async (code) => {
    rl.close();
    if (!code) {
      console.log("Skipped token exchange.");
      return;
    }
    try {
      const token = await exchangeMalCodeForToken(code.trim(), codeVerifier);
      console.log("\nToken response:", token);
    } catch (err) {
      console.error("\nToken exchange failed:", err);
    }
  });
}

testMalAuth();
