import { proxyRequest } from "../../../server/proxy.js";

export default async function handler(req, res) {
  const textId = req.query.textId || "";
  return proxyRequest(req, res, `analysis/${textId}/words`);
}
