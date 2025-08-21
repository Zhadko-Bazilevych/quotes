export function range(start: number, stop?: number): number[] {
  stop ??= start * 2;
  const add = stop ? start : 0;
  return Array.from({ length: stop - start }).map((_, i) => i + add);
}
