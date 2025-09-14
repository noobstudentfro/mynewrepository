import fetch from "node-fetch";

export default async function handler(req, res) {
  try {
    let { url } = req.query;

    if (!url) {
      return res.status(400).json({ error: "Missing url parameter" });
    }

    // Decode it (since we encoded it in frontend)
    url = decodeURIComponent(url);

    // Validate
    if (!/^https?:\/\//i.test(url)) {
      return res.status(400).json({ error: "Invalid URL" });
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
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
