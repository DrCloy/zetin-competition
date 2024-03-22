export function checkDateTerm(comp: Date, start: Date, end: Date): boolean {
  return comp >= start && comp <= end;
}
