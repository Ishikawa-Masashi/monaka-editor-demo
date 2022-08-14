export function toFullWidth(value: string): string {
  return value.replace(/[A-Za-z0-9!-~]/g, (s) =>
    String.fromCharCode(s.charCodeAt(0) + 0xfee0)
  );
}
