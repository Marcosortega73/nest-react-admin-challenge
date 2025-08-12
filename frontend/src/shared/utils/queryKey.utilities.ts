/**
 * Generates a stable queryKey string for react-query from a plain object.
 * - Converts null/undefined values to an empty string for consistency.
 * - Sorts keys to keep output stable regardless of property insertion order.
 */
export function stableKeyQuery<T extends object>(obj: T): string {
  const entries = Object.entries(obj as Record<string, unknown>)
    .map(([k, v]) => [k, v ?? ''] as const)
    .sort(([a], [b]) => (a > b ? 1 : a < b ? -1 : 0));

  return JSON.stringify(Object.fromEntries(entries));
}
