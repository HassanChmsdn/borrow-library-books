"use client";

import * as React from "react";

import { formatTemplate } from "./format";
import { getI18nDictionary, type I18nDictionary } from "./dictionaries";
import { defaultLocale } from "./config";

const defaultDictionary = getI18nDictionary(defaultLocale);

const I18nContext = React.createContext<I18nDictionary>(defaultDictionary);

export function I18nProvider({
  children,
  dictionary,
}: {
  children: React.ReactNode;
  dictionary: I18nDictionary;
}) {
  return (
    <I18nContext.Provider value={dictionary}>{children}</I18nContext.Provider>
  );
}

export function useI18n() {
  const dictionary = React.useContext(I18nContext);

  const translateText = React.useCallback(
    (text: string) => dictionary.literalTranslations[text] ?? text,
    [dictionary.literalTranslations],
  );

  const formatMessage = React.useCallback(
    (template: string, values: Record<string, string | number | undefined>) =>
      formatTemplate(template, values),
    [],
  );

  return {
    ...dictionary,
    formatMessage,
    translateText,
  };
}