import { cookies } from "next/headers";

import {
  defaultLocale,
  isSupportedLocale,
  localeCookieName,
  type AppLocale,
} from "./config";
import { getI18nDictionary } from "./dictionaries";
import { formatTemplate } from "./format";

export async function getRequestLocale(): Promise<AppLocale> {
  const cookieStore = await cookies();
  const locale = cookieStore.get(localeCookieName)?.value;

  return isSupportedLocale(locale) ? locale : defaultLocale;
}

export async function getI18n() {
  const locale = await getRequestLocale();
  const dictionary = getI18nDictionary(locale);

  return {
    ...dictionary,
    formatMessage: formatTemplate,
    translateText: (text: string) => dictionary.literalTranslations[text] ?? text,
  };
}