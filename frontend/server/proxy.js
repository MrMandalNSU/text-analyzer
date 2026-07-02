const rawBackendApiUrl = process.env.BACKEND_API_URL;
const apiProxyPath = process.env.API_PROXY_PATH || process.env.VITE_API_PROXY_PATH;

function requiredConfig(value, key) {
  if (!value?.trim()) {
    throw new Error(`${key} is required.`);
  }

  return value.trim();
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function resolvePath(req, fallbackPath) {
  const incomingUrl = new URL(req.url, `https://${req.headers.host}`);
  const proxyPath = requiredConfig(apiProxyPath, "API_PROXY_PATH").replace(
    /\/$/,
    ""
  );
  const proxyPathPattern = new RegExp(`^${escapeRegExp(proxyPath)}\\/?`);
  const pathFromUrl = incomingUrl.pathname
    .replace(proxyPathPattern, "")
    .replace(/^\/+/, "");

  return {
    path: pathFromUrl || fallbackPath || "",
    search: incomingUrl.search,
  };
}

export async function proxyRequest(req, res, fallbackPath = "") {
  const backendApiUrl = requiredConfig(rawBackendApiUrl, "BACKEND_API_URL").replace(
    /\/$/,
    ""
  );
  const { path, search } = resolvePath(req, fallbackPath);
  const target = new URL(`${backendApiUrl}/${path}`);
  target.search = search;

  res.setHeader("X-Text-Analyzer-Proxy", "route-v2");

  const headers = new Headers(req.headers);
  headers.delete("host");
  headers.delete("content-length");

  try {
    const upstream = await fetch(target, {
      method: req.method,
      headers,
      body: ["GET", "HEAD"].includes(req.method)
        ? undefined
        : JSON.stringify(req.body),
      redirect: "manual",
    });

    res.status(upstream.status);
    upstream.headers.forEach((value, key) => {
      if (
        !["content-encoding", "content-length", "transfer-encoding"].includes(
          key
        )
      ) {
        res.setHeader(key, value);
      }
    });

    const body = Buffer.from(await upstream.arrayBuffer());
    res.send(body);
  } catch (error) {
    res.status(502).json({ message: "Backend proxy request failed." });
  }
}
