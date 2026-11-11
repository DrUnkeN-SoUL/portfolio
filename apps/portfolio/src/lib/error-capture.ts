// Captures the original Error out-of-band so server.ts can recover the stack
// when h3 has already swallowed the throw into a generic 500 Response.

let lastCapturedError: { error: unknown; at: number } | undefined;

function record(error: unknown) {
  lastCapturedError = { error, at: Date.now() };
}

// h3's HTTPError serializes to {"status":500,"unhandled":true,"message":"HTTPError"} —
// no stack, no cause — so a plain console.error(error) reaches the log pipeline with
// the failure detail stripped. Expand Error-like args into a string that keeps the
// message, stack, and the full cause chain.
function describeError(error: unknown): string {
  const parts: string[] = [];
  let current: unknown = error;
  for (let depth = 0; depth < 5 && current != null; depth++) {
    if (!(current instanceof Error)) {
      let text: string;
      try {
        text = typeof current === "string" ? current : (JSON.stringify(current) ?? String(current));
      } catch {
        text = String(current);
      }
      parts.push(text);
      break;
    }
    const { status, statusCode } = current as { status?: unknown; statusCode?: unknown };
    const code = status ?? statusCode;
    parts.push(
      `${depth === 0 ? "" : "caused by: "}${current.stack ?? `${current.name}: ${current.message}`}${typeof code === "number" ? ` (status ${code})` : ""}`,
    );
    current = current.cause;
  }
  return parts.join("\n").slice(0, 8_000);
}

// Wrap console.error so errors logged by any layer — including h3's internal
// unhandled-error logging, which this file cannot hook directly — are both
// recorded for consumeLastCapturedError and expanded before serialization.
const originalConsoleError = console.error.bind(console);
console.error = (...args: unknown[]) => {
  originalConsoleError(
    ...args.map((arg) => {
      if (!(arg instanceof Error)) return arg;
      record(arg);
      return describeError(arg);
    }),
  );
};

if (typeof globalThis.addEventListener === "function") {
  globalThis.addEventListener("error", (event) => record((event as ErrorEvent).error ?? event));
  globalThis.addEventListener("unhandledrejection", (event) =>
    record((event as PromiseRejectionEvent).reason),
  );
}

export function consumeLastCapturedError(): unknown {
  if (!lastCapturedError) return undefined;
  if (Date.now() - lastCapturedError.at > 5_000) {
    lastCapturedError = undefined;
    return undefined;
  }
  const { error } = lastCapturedError;
  lastCapturedError = undefined;
  return error;
}
