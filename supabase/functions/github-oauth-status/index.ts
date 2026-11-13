import { appUserReconnectRequired } from "../_shared/appUserConnector.ts";
import { deleteConnectionKeyForUser, getConnectionKeyForUser } from "../_shared/appUserConnections.ts";
import { disconnectAppUser } from "../_shared/disconnectAppUser.ts";
import { GITHUB_SCOPES } from "../_shared/appUserScopes.ts";
import { authenticatedUser, errorResponse, jsonResponse, preflightResponse, readJson } from "../_shared/http.ts";
import { callAsAppUser } from "../_shared/appUserConnector.ts";

const gatewayBaseUrl = "https://connector-gateway.lovable.dev";

Deno.serve(async (req) => {
  const preflight = preflightResponse(req);
  if (preflight) return preflight;
  if (req.method !== "GET" && req.method !== "POST") return jsonResponse({ error: "Method not allowed" }, 405);
  try {
    const user = await authenticatedUser(req);
    if (!user) return jsonResponse({ error: "Sign in to manage GitHub." }, 401);
    const key = await getConnectionKeyForUser(user.id, "github");
    if (!key) return jsonResponse({ connected: false });
    const body = req.method === "POST" ? await readJson(req) : {};
    if (body.disconnect === true) {
      await disconnectAppUser({ gatewayBaseUrl, connectionAPIKey: key, connectorId: "github" });
      await deleteConnectionKeyForUser(user.id, "github");
      return jsonResponse({ connected: false, disconnected: true });
    }
    const response = await callAsAppUser({
      gatewayBaseUrl,
      connectionAPIKey: key,
      connectorId: "github",
      path: "/user",
      requiredScopes: GITHUB_SCOPES,
      init: { method: "GET", headers: { Accept: "application/vnd.github+json" } },
    });
    if (await appUserReconnectRequired(response)) return jsonResponse({ connected: false, reconnectRequired: true });
    if (!response.ok) {
      const detail = await response.text();
      console.error(`GitHub account status failed [${response.status}]: ${detail.slice(0, 500)}`);
      return jsonResponse({ error: "GitHub could not be reached. Try again or reconnect your account." }, 502);
    }
    const profile = await response.json() as { login?: string; name?: string | null; avatar_url?: string };
    return jsonResponse({ connected: true, account: { login: profile.login ?? "", name: profile.name ?? null, avatarUrl: profile.avatar_url ?? null } });
  } catch (error) {
    console.error("GitHub account status failed:", error);
    return errorResponse(error);
  }
});