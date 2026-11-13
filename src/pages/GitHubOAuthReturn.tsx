import { useEffect, useState } from "react";
import { CheckCircle2, Loader2, ShieldAlert } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const GitHubOAuthReturn = () => {
  const [message, setMessage] = useState("Finishing your GitHub connection…");
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const finish = (type: "appUserConnectorOAuthComplete" | "appUserConnectorOAuthFailed", reason?: string) => {
      window.opener?.postMessage({ type, connectorId: "github", reason }, window.location.origin);
      if (type === "appUserConnectorOAuthComplete") window.close();
    };
    if (params.get("success") !== "true") {
      const reason = params.get("error") ?? "GitHub authorization was not completed.";
      setMessage(reason);
      setFailed(true);
      finish("appUserConnectorOAuthFailed", reason);
      return;
    }
    const code = params.get("code");
    if (!code) {
      const reason = params.get("offline_access_allowed") === "false"
        ? "A workspace administrator must allow offline access for this GitHub connector."
        : "GitHub did not return an authorization code.";
      setMessage(reason);
      setFailed(true);
      finish("appUserConnectorOAuthFailed", reason);
      return;
    }
    void supabase.functions.invoke("github-oauth-complete", { body: { code } }).then(({ error }) => {
      if (error) throw error;
      setMessage("GitHub is connected. This window can close.");
      finish("appUserConnectorOAuthComplete");
    }).catch(() => {
      const reason = "We could not finish connecting GitHub. Close this window and try again.";
      setMessage(reason);
      setFailed(true);
      finish("appUserConnectorOAuthFailed", reason);
    });
  }, []);

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="max-w-md text-center space-y-4">
        {failed ? <ShieldAlert className="w-10 h-10 text-destructive mx-auto" /> : message.startsWith("GitHub is connected") ? <CheckCircle2 className="w-10 h-10 text-primary mx-auto" /> : <Loader2 className="w-10 h-10 text-primary mx-auto animate-spin" />}
        <p className="text-sm text-foreground">{message}</p>
      </div>
    </main>
  );
};

export default GitHubOAuthReturn;