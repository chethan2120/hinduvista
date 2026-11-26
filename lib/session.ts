export const SESSION_COOKIE = "hv_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

type SessionPayload = { sub: string; exp: number };

function bytesToBase64Url(bytes: Uint8Array) {
  let binary = "";
  for (let index = 0; index < bytes.length; index += 1) {
    binary += String.fromCharCode(bytes[index]);
  }
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/g, "");
}

function base64UrlToBytes(value: string) {
  const padding = value.length % 4 === 0 ? "" : "=".repeat(4 - (value.length % 4));
  const base64 = value.replaceAll("-", "+").replaceAll("_", "/") + padding;
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}

async function hmacKey() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error("AUTH_SECRET is not configured.");
  }
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

export async function signSession(userId: string) {
  const payload = bytesToBase64Url(
    new TextEncoder().encode(
      JSON.stringify({ sub: userId, exp: Date.now() + SESSION_MAX_AGE * 1000 } satisfies SessionPayload),
    ),
  );
  const signature = await crypto.subtle.sign("HMAC", await hmacKey(), new TextEncoder().encode(payload));
  return `${payload}.${bytesToBase64Url(new Uint8Array(signature))}`;
}

export async function verifySession(token: string | undefined | null): Promise<{ sub: string } | null> {
  if (!token) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;
  try {
    const valid = await crypto.subtle.verify(
      "HMAC",
      await hmacKey(),
      base64UrlToBytes(signature),
      new TextEncoder().encode(payload),
    );
    if (!valid) return null;
    const data = JSON.parse(new TextDecoder().decode(base64UrlToBytes(payload))) as Partial<SessionPayload>;
    if (!data.sub || !data.exp || data.exp < Date.now()) return null;
    return { sub: data.sub };
  } catch {
    return null;
  }
}
