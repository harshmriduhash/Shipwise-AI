function requireApiKey(): string {
  const key = Deno.env.get("LOVABLE_API_KEY");
  if (!key) throw new Error("LOVABLE_API_KEY is not set");
  return key;
}

export async function authorizeAppUserOAuth(params: {
  gatewayBaseUrl: string;
  connectorId: string;
  appUserId: string;
  clientAPIKey: string;
  returnUrl: string;
  credentialsConfiguration?: Record<string, unknown>;
}): Promise<{ authorizationUrl: string }> {
  const response = await fetch(`${params.gatewayBaseUrl}/api/v1/app-users/oauth2/authorize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${requireApiKey()}`,
      "Content-Type": "application/json",
      "X-Client-Api-Key": params.clientAPIKey,
    },
    body: JSON.stringify({
      connector_id: params.connectorId,
      app_user_id: params.appUserId,
      return_url: params.returnUrl,
      credentials_configuration: params.credentialsConfiguration,
    }),
  });
  const text = await response.text();
  if (!response.ok) throw new Error(`GitHub authorization could not start (${response.status}): ${text}`);
  const result = JSON.parse(text) as { authorization_url?: string };
  if (!result.authorization_url) throw new Error("GitHub authorization URL was missing");
  return { authorizationUrl: result.authorization_url };
}

export async function exchangeAppUserOAuthCode(
  gatewayBaseUrl: string,
  code: string,
): Promise<{ connectionAPIKey: string; connectorId: string }> {
  const response = await fetch(`${gatewayBaseUrl}/api/v1/app-users/oauth2/exchange`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${requireApiKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code }),
  });
  const text = await response.text();
  if (!response.ok) throw new Error(`GitHub authorization could not be completed (${response.status})`);
  const result = JSON.parse(text) as { api_key?: string; connector_id?: string };
  if (!result.api_key || !result.connector_id) throw new Error("GitHub authorization response was incomplete");
  return { connectionAPIKey: result.api_key, connectorId: result.connector_id };
}

export async function callAsAppUser(params: {
  gatewayBaseUrl: string;
  connectionAPIKey: string;
  connectorId: string;
  path: string;
  init?: RequestInit;
  requiredScopes?: string[];
}): Promise<Response> {
  const headers = new Headers(params.init?.headers);
  headers.set("Authorization", `Bearer ${requireApiKey()}`);
  headers.set("X-Connection-Api-Key", params.connectionAPIKey);
  if (params.requiredScopes?.length) {
    headers.set("X-Lovable-Required-Scopes", params.requiredScopes.join(" "));
  }
  return fetch(`${params.gatewayBaseUrl}/${params.connectorId}${params.path.startsWith("/") ? params.path : `/${params.path}`}`, {
    ...params.init,
    headers,
  });
}

export async function appUserReconnectRequired(response: Response): Promise<boolean> {
  if (response.status !== 401) return false;
  const body = await response.clone().json().catch(() => null) as { type?: unknown } | null;
  return typeof body?.type === "string" && body.type.startsWith("credential_");
}
export { disconnectAppUser } from "./disconnectAppUser.ts";