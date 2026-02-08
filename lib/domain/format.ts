/**
 * Format a GitHub star count for compact display.
 *
 * - Below 1,000: exact number (e.g., "42", "999")
 * - At 1,000+: abbreviated with 'k' suffix (e.g., "1.2k", "10k")
 * - Negative input defaults to "0"
 */
export const formatStarsCount = (count: number): string => {
  if (count < 0) return '0'
  if (count < 1000) return count.toString()
  const k = count / 1000
  if (k % 1 === 0) return `${k}k`
  const rounded = k.toFixed(1)
  return rounded.endsWith('.0') ? `${rounded.slice(0, -2)}k` : `${rounded}k`
}
