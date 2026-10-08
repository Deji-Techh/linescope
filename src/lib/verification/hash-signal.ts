import type { Signal } from "../signals/types";

function stableStringify(value: unknown): string {
  if (Array.isArray(value)) {
    return `[${value.map(stableStringify).join(",")}]`;
  }

  if (value && typeof value === "object") {
    return `{${Object.entries(value as Record<string, unknown>)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, item]) => `${JSON.stringify(key)}:${stableStringify(item)}`)
      .join(",")}}`;
  }

  return JSON.stringify(value);
}

function fallbackHash(input: string): string {
  let hash = 0x811c9dc5;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return `0x${(hash >>> 0).toString(16).padStart(8, "0")}`;
}

export function hashSignal(signal: Signal): string {
  const payload = stableStringify({
    fixtureId: signal.fixtureId,
    type: signal.type,
    summary: signal.summary,
    metrics: signal.metrics,
    evidence: signal.evidence,
    createdAt: signal.createdAt,
  });

  return fallbackHash(payload);
}
