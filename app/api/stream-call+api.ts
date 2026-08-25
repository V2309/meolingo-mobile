import crypto from "crypto";

const STREAM_API_KEY = process.env.STREAM_API_KEY;
const STREAM_API_SECRET = process.env.STREAM_API_SECRET;

// Base64Url encode helper for manual JWT creation
function base64UrlEncode(str: string): string {
  return Buffer.from(str)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

// Generate GetStream token (HS256 signature using STREAM_API_SECRET)
function signStreamToken(userId: string, apiKey: string, apiSecret: string): string {
  const header = {
    alg: "HS256",
    typ: "JWT",
  };

  const payload = {
    user_id: userId,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // Expires in 24 hours
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));

  const signatureInput = `${encodedHeader}.${encodedPayload}`;
  const signature = crypto
    .createHmac("sha256", apiSecret)
    .update(signatureInput)
    .digest("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

export async function POST(request: Request) {
  try {
    if (!STREAM_API_KEY || !STREAM_API_SECRET) {
      return new Response(
        JSON.stringify({ error: "Server configuration error: missing Stream API credentials" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // 1. Authenticate with Clerk Token
    const authHeader = request.headers.get("Authorization");
    const clerkToken = authHeader?.replace("Bearer ", "");
    if (!clerkToken) {
      return new Response(
        JSON.stringify({ error: "Unauthorized: Missing authorization header" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    // 2. Decode the Clerk JWT token (networkless decode and expiry check)
    let payload: any;
    try {
      const parts = clerkToken.split(".");
      if (parts.length !== 3) {
        throw new Error("Invalid JWT token format");
      }
      payload = JSON.parse(Buffer.from(parts[1], "base64").toString("utf-8"));
    } catch {
      return new Response(
        JSON.stringify({ error: "Unauthorized: Invalid token structure" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    // Check expiration of Clerk JWT
    if (payload.exp && Date.now() / 1000 > payload.exp) {
      return new Response(
        JSON.stringify({ error: "Unauthorized: Clerk session expired" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    // Clerk User ID is inside the 'sub' claim of the JWT
    const authenticatedUserId = payload.sub;
    if (!authenticatedUserId) {
      return new Response(
        JSON.stringify({ error: "Unauthorized: Missing subject claim" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    // 3. Parse and validate body parameters
    const body = await request.json();
    const { userId, lessonId, languageId } = body;

    if (!userId || !lessonId || !languageId) {
      return new Response(
        JSON.stringify({ error: "Bad Request: Missing required parameters" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Ensure user is only creating a call for themselves (verify subject matches body user ID)
    if (userId !== authenticatedUserId) {
      return new Response(
        JSON.stringify({ error: "Unauthorized: User ID mismatch" }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }

    // Sanitize user ID to match Stream requirements (^[a-zA-Z0-9_-]+$)
    const streamUserId = userId.replace(/[^a-zA-Z0-9_-]/g, "_");

    // 4. Generate user-specific Stream token
    const userStreamToken = signStreamToken(streamUserId, STREAM_API_KEY, STREAM_API_SECRET);

    // 5. Create/Retrieve Call session on Stream REST API
    const callType = "default";
    const callId = `audio-${languageId}-${lessonId}-${streamUserId}`.toLowerCase();
    
    // Generate server admin token to perform REST action
    const serverAdminToken = signStreamToken("server-admin", STREAM_API_KEY, STREAM_API_SECRET);

    const streamUrl = `https://video.stream-io-api.com/api/v2/video/call/${callType}/${callId}?api_key=${STREAM_API_KEY}`;
    
    const streamResponse = await fetch(streamUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Stream-Auth-Type": "jwt",
        Authorization: serverAdminToken,
      },
      body: JSON.stringify({
        data: {
          created_by_id: streamUserId,
          members: [
            { user_id: streamUserId, role: "user" }
          ]
        }
      }),
    });

    if (!streamResponse.ok) {
      const errorText = await streamResponse.text();
      console.error("Stream call creation error:", errorText);
      return new Response(
        JSON.stringify({ error: "Failed to initialize call session on Stream server" }),
        { status: 502, headers: { "Content-Type": "application/json" } }
      );
    }

    // 6. Return connection credentials
    return new Response(
      JSON.stringify({
        token: userStreamToken,
        apiKey: STREAM_API_KEY,
        callId,
        callType,
        streamUserId
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error generating token and call:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
