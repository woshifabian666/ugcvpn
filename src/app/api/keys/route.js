import { auth } from "@clerk/nextjs/server";

export async function GET() {
  const { userId, sessionClaims } = auth();

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const email = sessionClaims?.email;

  if (!email) {
    return new Response("Missing email", { status: 400 });
  }

  // Your backend URL (server.js)
  const BACKEND_URL = "http://localhost:3000/keys?email=" + encodeURIComponent(email);

  try {
    const res = await fetch(BACKEND_URL);
    const data = await res.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response("Backend error", { status: 500 });
  }
}
