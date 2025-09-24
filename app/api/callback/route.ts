// app/api/callback/route.ts
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const code = url.searchParams.get("code");
    const error = url.searchParams.get("error");

    if (error) {
      return new Response(`<h1>Spotify authorization error</h1><pre>${error}</pre>`, {
        status: 400,
        headers: { "Content-Type": "text/html" },
      });
    }
    if (!code) {
      return new Response(`<h1>No code received</h1>`, { status: 400, headers: { "Content-Type": "text/html" } });
    }

    const clientId = process.env.SPOTIFY_CLIENT_ID!;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET!;
    const redirectUri = process.env.SPOTIFY_REDIRECT_URI!;
    const creds = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

    const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${creds}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
      }),
    });

    const tokenData = await tokenRes.json();

    // tokenData contains: access_token, token_type, expires_in, refresh_token (if granted), scope
    // We show the refresh_token to the user so they can copy it to their Vercel env.
    const refreshToken = tokenData.refresh_token;

    const html = `
      <html>
        <body style="font-family: sans-serif; padding: 2rem;">
          <h1>Spotify authorization complete</h1>
          <p><strong>Important (one-time):</strong> copy the <code>refresh_token</code> below and set it as <code>SPOTIFY_REFRESH_TOKEN</code> in your Vercel Environment Variables (or your .env.local if testing locally).</p>
          <pre style="background:#eee;padding:1rem;border-radius:6px;overflow-x:auto;">${refreshToken ?? "NO_REFRESH_TOKEN_RETURNED"}</pre>
          <p>After saving the refresh token in Vercel, redeploy the site (or restart your local dev server).</p>
          <p><a href="/">Return to site</a></p>
          <hr />
          <h3>Debug info (don't share publicly)</h3>
          <pre>${JSON.stringify(tokenData, null, 2)}</pre>
        </body>
      </html>
    `;
    return new Response(html, { headers: { "Content-Type": "text/html" } });
  } catch (err: any) {
    return new Response(`<h1>Error</h1><pre>${String(err)}</pre>`, { status: 500, headers: { "Content-Type": "text/html" } });
  }
}
