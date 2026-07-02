const rawBackendApiUrl = process.env.BACKEND_API_URL;

function normalizeBackendApiUrl(value) {
  const url = new URL(value);
  const pathname = url.pathname.replace(/\/$/, "");

  if (!pathname.endsWith("/api")) {
    url.pathname = `${pathname}/api`;
  }

  return url.toString().replace(/\/$/, "");
}

export default async function handler(req, res) {
  if (!rawBackendApiUrl) {
    res.status(500).json({ message: "BACKEND_API_URL is not configured." });
    return;
  }

  const backendApiUrl = normalizeBackendApiUrl(rawBackendApiUrl);
  const incomingUrl = new URL(req.url, `https://${req.headers.host}`);
  const path = incomingUrl.pathname.replace(/^\/api\/?/, "");
  const target = new URL(`${backendApiUrl}/${path}`);
  target.search = incomingUrl.search;

  res.setHeader("X-Text-Analyzer-Proxy", "url-path-v1");

  const headers = new Headers(req.headers);
  headers.delete("host");
  headers.delete("content-length");

  try {
    const upstream = await fetch(target, {
      method: req.method,
      headers,
      body: ["GET", "HEAD"].includes(req.method) ? undefined : JSON.stringify(req.body),
      redirect: "manual",
    });

    res.status(upstream.status);
    upstream.headers.forEach((value, key) => {
      if (!["content-encoding", "content-length", "transfer-encoding"].includes(key)) {
        res.setHeader(key, value);
      }
    });

    const body = Buffer.from(await upstream.arrayBuffer());
    res.send(body);
  } catch (error) {
    res.status(502).json({ message: "Backend proxy request failed." });
  }
}
