import { authorizeAppUserOAuth } from "../_shared/appUserConnector.ts";
import { GITHUB_SCOPES } from "../_shared/appUserScopes.ts";
import { authenticatedUser, errorResponse, jsonResponse, preflightResponse, readJson } from "../_shared/http.ts";

const GATEWAY_BASE_URL = "https://connector-gateway.lovable.dev";

Deno.serve(async (req) => {
  const preflight = preflightResponse(req);
  if (preflight) return preflight;
  if (req.method !== "POST") return jsonResponse({ error: "Method not allowed" }, 405);
  try {
    const user = await authenticatedUser(req);
    if (!user) return jsonResponse({ error: "Sign in to connect GitHub." }, 401);
    const body = await readJson(req);
    const origin = typeof body.origin === "string" ? body.origin : "";
    const requestOrigin = req.headers.get("Origin");
    let parsedOrigin: URL;
    try {
      parsedOrigin = new URL(origin);
    } catch {
      return jsonResponse({ error: "A valid app origin is required." }, 400);
    }
    if (parsedOrigin.origin !== origin || (requestOrigin && requestOrigin !== origin) ||
        (parsedOrigin.protocol !== "https:" && parsedOrigin.hostname !== "localhost")) {
      return jsonResponse({ error: "The authorization return address is invalid." }, 400);
    }
    const clientAPIKey = Deno.env.get("GITHUB_APP_USER_CONNECTOR_CLIENT_API_KEY");
    if (!clientAPIKey) return jsonResponse({ error: "GitHub account connections are not configured. Link the GitHub connector first." }, 503);
    const { authorizationUrl } = await authorizeAppUserOAuth({
      gatewayBaseUrl: GATEWAY_BASE_URL,
      connectorId: "github",
      appUserId: user.id,
      clientAPIKey,
      returnUrl: new URL("/oauth/github/return", origin).toString(),
      credentialsConfiguration: { scopes: GITHUB_SCOPES },
    });
    return jsonResponse({ authorizationUrl });
  } catch (error) {
    console.error("GitHub OAuth start failed:", error);
    return errorResponse(error);
  }
});