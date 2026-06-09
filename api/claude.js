export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "API key not configured" });
  }

  try {
    // Vercel auto-parsea JSON, pero por si acaso
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const { prompt } = body || {};
    if (!prompt) return res.status(400).json({ error: "Missing prompt" });

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-5",
        max_tokens: 2000,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Anthropic error:", JSON.stringify(data));
      return res.status(200).json({ error: JSON.stringify(data) });
    }

    const text = (data.content?.[0]?.text || "").replace(/```json|```/g, "").trim();
    res.status(200).json({ text });
  } catch (e) {
    console.error("Handler error:", e.message);
    res.status(200).json({ error: e.message });
  }
}
