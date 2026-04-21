import { arMessages } from "./messages/ar";
import { deMessages } from "./messages/de";
import { defaultLocale, getLocaleDirection, type AppLocale } from "./config";

export interface AppMessages {
  ui: {
    adminConsoleName: string;
    appName: string;
    languageSwitcher: {
      label: string;
      locales: Record<AppLocale, string>;
      selectLabel: string;
    };
    publicLibraryName: string;
  };
  templates: {
    borrowings: {
      plural: string;
      sectionItems: string;
      singular: string;
    };
    catalog: {
      booksFound: string;
      inCategory: string;
      plural: string;
      singular: string;
    };
  };
  literals: Record<string, NestedLiteralDictionary>;
}

type NestedLiteralDictionary = {
  [key: string]: string | NestedLiteralDictionary;
};

function flattenLiteralTranslations(
  value: NestedLiteralDictionary,
  store: Record<string, string> = {},
) {
  for (const entry of Object.values(value)) {
    if (typeof entry === "string") {
      continue;
    }

    flattenLiteralTranslations(entry, store);
  }

  for (const [key, entry] of Object.entries(value)) {
    if (typeof entry === "string") {
      store[key] = entry;
    }
  }

  return store;
}

const messageCatalog = {
  ar: arMessages,
  de: deMessages,
} satisfies Record<AppLocale, AppMessages>;

export interface I18nDictionary {
  dir: "ltr" | "rtl";
  literalTranslations: Record<string, string>;
  locale: AppLocale;
  messages: AppMessages;
}

export function getI18nDictionary(locale: AppLocale = defaultLocale): I18nDictionary {
  const messages = messageCatalog[locale] ?? messageCatalog[defaultLocale];

  return {
    dir: getLocaleDirection(locale),
    literalTranslations: flattenLiteralTranslations(
      messages.literals as NestedLiteralDictionary,
    ),
    locale,
    messages,
  };
}