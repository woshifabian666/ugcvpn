export const runtime = "edge";

import { auth } from "@clerk/nextjs/server";

export async function GET() {
  const { userId, sessionClaims } = auth();

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const email = sessionClaims?.email ?? sessionClaims?.primaryEmail;

  if (!email) {
    return new Response("Missing email", { status: 400 });
  }

  // Use Cloudflare Tunnel backend URL, NOT localhost
  const BACKEND_URL = "https://api.ugcvpn.com/keys?email=" + encodeURIComponent(email);

  try {
    const res = await fetch(BACKEND_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Backend error:", err);
    return new Response("Backend error", { status: 500 });
  }
}