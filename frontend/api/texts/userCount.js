import { proxyRequest } from "../../server/proxy.js";

export default async function handler(req, res) {
  return proxyRequest(req, res, "texts/userCount");
}
