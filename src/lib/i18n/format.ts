export function formatTemplate(
  template: string,
  values: Record<string, string | number | undefined>,
) {
  return template.replace(/\{(.*?)\}/g, (_, key: string) => {
    const value = values[key.trim()];

    return value === undefined ? "" : String(value);
  });
}