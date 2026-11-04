/**
 * Groups rows by key and returns the groups in the exact order of `keys`
 * (missing keys get an empty array) — the contract DataLoader batch
 * functions must fulfil.
 */
export function groupByKey<K, V>(
  keys: readonly K[],
  rows: readonly V[],
  keyOf: (row: V) => K,
): V[][] {
  const groups = new Map<K, V[]>();
  for (const row of rows) {
    const key = keyOf(row);
    const group = groups.get(key);
    if (group) {
      group.push(row);
    } else {
      groups.set(key, [row]);
    }
  }
  return keys.map((key) => groups.get(key) ?? []);
}
