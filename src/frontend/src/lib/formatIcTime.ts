import type { Time } from '../backend';

/**
 * Converts IC Time (bigint nanoseconds since epoch) to a human-readable timestamp string
 */
export function formatIcTime(time: Time): string {
  // Convert nanoseconds to milliseconds
  const milliseconds = Number(time / BigInt(1_000_000));
  const date = new Date(milliseconds);
  
  // Format: "Feb 16, 2026, 10:30:45 AM"
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
}
