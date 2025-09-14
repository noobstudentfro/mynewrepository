import fetch from "node-fetch";

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: "Missing 'url' query parameter" });
  }

  try {
    const response = await fetch(url, {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
        ...req.headers
      },
      body: req.method !== "GET" ? JSON.stringify(req.body) : undefined
    });

    const data = await response.text();

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", response.headers.get("content-type") || "application/json");
    res.status(response.status).send(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
