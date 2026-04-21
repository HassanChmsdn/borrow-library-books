import { formatTemplate } from "@/lib/i18n";

export function translateCatalogAvailabilityLabel(
  label: string,
  translateText: (value: string) => string,
) {
  const match = label.match(/^(\d+)\/(\d+) available$/);

  if (match) {
    const [, available, total] = match;

    return formatTemplate(translateText("{available}/{total} available"), {
      available,
      total,
    });
  }

  return translateText(label);
}

export function translateCatalogFeeLabel(
  label: string,
  translateText: (value: string) => string,
) {
  if (label === "Free") {
    return translateText(label);
  }

  const match = label.match(/^(\$[\d.]+) cash$/);

  if (match) {
    const [, amount] = match;

    return formatTemplate(translateText("{amount} cash"), {
      amount,
    });
  }

  return translateText(label);
}