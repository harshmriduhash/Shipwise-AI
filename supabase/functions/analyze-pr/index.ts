import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { title, branch, author, files, additions, deletions, changedFiles, diffContent } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are SHIPWISE.ai, an expert AI code reviewer and quality intelligence system. 
You analyze pull requests and provide:
1. Risk scores (0-100) for logic risk, integration risk, and regression risk
2. An overall risk score (weighted average)
3. A concise summary of what the PR does
4. Specific test suggestions with priority (critical/high/medium/low)
5. Code review comments highlighting potential issues

Respond ONLY with valid JSON matching this exact schema:
{
  "overallRisk": number,
  "riskBreakdown": { "logic": number, "integration": number, "regression": number },
  "summary": "string - 2-3 sentence summary of the PR",
  "verdict": "string - one of: 'safe_to_ship', 'review_recommended', 'high_risk_block'",
  "verdictMessage": "string - brief explanation of the verdict",
  "tests": [{ "text": "string", "priority": "critical|high|medium|low" }],
  "reviewComments": [{ "file": "string", "comment": "string", "severity": "error|warning|info" }]
}`;

    const userPrompt = `Analyze this Pull Request:

**Title:** ${title}
**Branch:** ${branch}
**Author:** ${author}
**Files Changed:** ${files}
**Additions:** +${additions}
**Deletions:** -${deletions}

**Changed Files:**
${(changedFiles || []).map((f: any) => `- ${f.name} (+${f.additions}, -${f.deletions})`).join("\n")}

${diffContent ? `**Diff Content:**\n\`\`\`\n${diffContent}\n\`\`\`` : "No diff content provided - analyze based on file names and PR metadata."}

Provide your complete analysis as JSON.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway returned ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    // Extract JSON from the response (handle markdown code blocks)
    let jsonStr = content;
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1].trim();
    }

    const analysis = JSON.parse(jsonStr);

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze-pr error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Analysis failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
