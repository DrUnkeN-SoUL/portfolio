import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntry: Promise<ServerEntry> | undefined;

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      serverEntry ??= import("@tanstack/react-start/server-entry").then(
        (m) => (m.default ?? m) as ServerEntry,
      );
      const response = await (await serverEntry).fetch(request, env, ctx);
      if (
        response.status < 500 ||
        !(response.headers.get("content-type") ?? "").includes("application/json")
      ) {
        return response;
      }

      // h3 swallows in-handler throws into a normal 500 Response with body
      // {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
      const body = await response.clone().text();
      let payload: { unhandled?: unknown; message?: unknown } | null;
      try {
        payload = JSON.parse(body);
      } catch {
        return response;
      }
      if (payload?.unhandled !== true || payload.message !== "HTTPError") return response;

      console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
    } catch (error) {
      console.error(error);
    }
    return new Response(renderErrorPage(), {
      status: 500,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  },
};
