import fetch from "node-fetch";

export default async function handler(req, res) {
  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({ error: "Missing url parameter" });
    }

    // Make sure the URL starts with http
    if (!/^https?:\/\//i.test(url)) {
      return res.status(400).json({ error: "Invalid URL" });
    }

    const response = await fetch(url, {
      headers: {
        // Pass Binance host headers correctly
        "User-Agent": "Mozilla/5.0",
      },
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
