function requireApiKey(): string {
  const key = Deno.env.get("LOVABLE_API_KEY");
  if (!key) throw new Error("LOVABLE_API_KEY is not set");
  return key;
}

export async function disconnectAppUser(params: {
  gatewayBaseUrl: string;
  connectionAPIKey: string;
  connectorId: string;
}): Promise<void> {
  const response = await fetch(`${params.gatewayBaseUrl}/api/v1/app-users/connection`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${requireApiKey()}`,
      "X-Connection-Api-Key": params.connectionAPIKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ connector_id: params.connectorId }),
  });
  if (!response.ok) throw new Error(`GitHub access could not be disconnected (${response.status})`);
}