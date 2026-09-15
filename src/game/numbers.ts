/**
 * Number helpers for game values.
 * v0.0.1 uses plain JavaScript numbers; swap later without rewriting UI.
 */

export type GameNumber = number;

export function add(a: GameNumber, b: GameNumber): GameNumber {
  return a + b;
}

export function sub(a: GameNumber, b: GameNumber): GameNumber {
  return a - b;
}

export function gte(a: GameNumber, b: GameNumber): boolean {
  return a >= b;
}

export function formatNumber(value: GameNumber): string {
  if (!Number.isFinite(value)) return "0";
  if (Number.isInteger(value)) return String(value);
  return value.toFixed(2);
}

export function formatPercent(fraction: number): string {
  return `${Math.round(fraction * 100)}%`;
}

export function formatDuration(ms: number): string {
  const seconds = ms / 1000;
  if (Number.isInteger(seconds)) return `${seconds}s`;
  return `${seconds.toFixed(1)}s`;
}
