import { adminClient } from "./http.ts";
import { decryptConnectionKey, encryptConnectionKey } from "./connectionKeyCrypto.ts";

export async function saveConnectionKeyForUser(userId: string, connectorId: string, key: string) {
  const { error } = await adminClient().from("app_user_connections").upsert({
    user_id: userId,
    connector_id: connectorId,
    connection_key_ciphertext: await encryptConnectionKey(key),
    updated_at: new Date().toISOString(),
  }, { onConflict: "user_id,connector_id" });
  if (error) throw error;
}

export async function getConnectionKeyForUser(userId: string, connectorId: string): Promise<string | null> {
  const { data, error } = await adminClient()
    .from("app_user_connections")
    .select("connection_key_ciphertext")
    .eq("user_id", userId)
    .eq("connector_id", connectorId)
    .maybeSingle();
  if (error) throw error;
  return data ? decryptConnectionKey(data.connection_key_ciphertext) : null;
}

export async function deleteConnectionKeyForUser(userId: string, connectorId: string) {
  const { error } = await adminClient()
    .from("app_user_connections")
    .delete()
    .eq("user_id", userId)
    .eq("connector_id", connectorId);
  if (error) throw error;
}