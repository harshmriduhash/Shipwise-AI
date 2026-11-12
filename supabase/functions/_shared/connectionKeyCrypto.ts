async function encryptionKey(): Promise<CryptoKey> {
  const encoded = Deno.env.get("APP_USER_CONNECTION_KEY_SECRET");
  if (!encoded) throw new Error("Connection encryption is not configured");
  const raw = Uint8Array.from(atob(encoded), char => char.charCodeAt(0));
  return crypto.subtle.importKey("raw", raw, "AES-GCM", false, ["encrypt", "decrypt"]);
}

export async function encryptConnectionKey(plaintext: string): Promise<string> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = new Uint8Array(await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    await encryptionKey(),
    new TextEncoder().encode(plaintext),
  ));
  const combined = new Uint8Array(iv.length + encrypted.length);
  combined.set(iv);
  combined.set(encrypted, iv.length);
  return btoa(String.fromCharCode(...combined));
}

export async function decryptConnectionKey(ciphertext: string): Promise<string> {
  const combined = Uint8Array.from(atob(ciphertext), char => char.charCodeAt(0));
  if (combined.length < 29) throw new Error("Stored GitHub connection is invalid");
  const plaintext = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: combined.subarray(0, 12) },
    await encryptionKey(),
    combined.subarray(12),
  );
  return new TextDecoder().decode(plaintext);
}