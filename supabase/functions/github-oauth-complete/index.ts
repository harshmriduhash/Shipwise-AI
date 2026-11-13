import { exchangeAppUserOAuthCode } from "../_shared/appUserConnector.ts";
import { saveConnectionKeyForUser } from "../_shared/appUserConnections.ts";
import { authenticatedUser, errorResponse, jsonResponse, preflightResponse, readJson } from "../_shared/http.ts";

Deno.serve(async (req) => {
  const preflight = preflightResponse(req);
  if (preflight) return preflight;
  if (req.method !== "POST") return jsonResponse({ error: "Method not allowed" }, 405);
  try {
    const user = await authenticatedUser(req);
    if (!user) return jsonResponse({ error: "Sign in to finish connecting GitHub." }, 401);
    const body = await readJson(req);
    const code = typeof body.code === "string" ? body.code : "";
    if (code.length < 1 || code.length > 4096 || !/^[A-Za-z0-9._~-]+$/.test(code)) {
      return jsonResponse({ error: "The GitHub authorization code is invalid." }, 400);
    }
    const { connectionAPIKey, connectorId } = await exchangeAppUserOAuthCode(
      "https://connector-gateway.lovable.dev",
      code,
    );
    if (connectorId !== "github") return jsonResponse({ error: "GitHub authorization returned an unexpected connector." }, 400);
    await saveConnectionKeyForUser(user.id, connectorId, connectionAPIKey);
    return jsonResponse({ ok: true });
  } catch (error) {
    console.error("GitHub OAuth completion failed:", error);
    return errorResponse(error);
  }
});