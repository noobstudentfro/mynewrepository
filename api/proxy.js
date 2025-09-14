// /pages/api/proxy.js
export default async function handler(req, res) {
  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({ error: "Missing url parameter" });
    }

    // ✅ Only allow Binance requests
    if (!/^https:\/\/api\.binance\.com/i.test(url)) {
      return res.status(400).json({ error: "Invalid target URL" });
    }

    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept": "application/json",
      },
    });

    const text = await response.text();

    // ✅ Add CORS so browser accepts
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (!response.ok) {
      return res.status(response.status).json({ error: text });
    }

    // ✅ Try JSON first, fallback to text
    try {
      const json = JSON.parse(text);
      return res.status(200).json(json);
    } catch {
      return res.status(200).send(text);
    }
  } catch (err) {
    console.error("❌ Proxy error:", err);
    return res.status(500).json({ error: err.message });
  }
}
