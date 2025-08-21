export function getTotalPages(total: number, pageSize: number): number {
  return Math.ceil(total / pageSize);
}

export function getOffset(page: number, pageSize: number): number {
  return (page - 1) * pageSize;
}
