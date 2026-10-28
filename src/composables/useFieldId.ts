let fieldCount = 0;

export function useFieldId(prefix = 'field'): string {
  fieldCount += 1;
  return `${prefix}-${fieldCount}`;
}
