import fetch from "node-fetch";

export default async function handler(req, res) {
  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({ error: "Missing url parameter" });
    }

    // 🔑 Decode encoded URL (fixes interval=1m issue)
    const targetUrl = decodeURIComponent(url);

    // Make sure the URL starts with http
    if (!/^https?:\/\//i.test(targetUrl)) {
      return res.status(400).json({ error: "Invalid URL" });
    }

    const response = await fetch(targetUrl, {
      headers: {
        // Some APIs (like Binance) require a proper User-Agent
        "User-Agent": "Mozilla/5.0",
      },
    });

    // If Binance returns error (like code:-1102), forward it
    const text = await response.text();
    try {
      const data = JSON.parse(text);
      res.status(response.status).json(data);
    } catch {
      res.status(response.status).send(text);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
