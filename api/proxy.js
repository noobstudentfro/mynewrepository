// /pages/api/proxy.js
import fetch from "node-fetch";

export default async function handler(req, res) {
  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({ error: "Missing url parameter" });
    }

    // Ensure it's a valid Binance URL
    if (!/^https:\/\/api\.binance\.com/i.test(url)) {
      return res.status(400).json({ error: "Invalid target URL" });
    }

    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: await response.text() });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    console.error("Proxy error:", err);
    return res.status(500).json({ error: err.message });
  }
}


