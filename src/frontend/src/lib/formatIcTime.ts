export function formatIcTime(icTime: bigint): string {
  const milliseconds = Number(icTime / 1_000_000n);
  const date = new Date(milliseconds);
  
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  };
  
  return date.toLocaleString('en-US', options);
}
