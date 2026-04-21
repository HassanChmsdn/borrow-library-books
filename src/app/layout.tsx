import type { Metadata } from "next";
import {
  Geist_Mono,
  Inter,
  Noto_Kufi_Arabic,
  Playfair_Display,
} from "next/font/google";

import { I18nProvider } from "@/lib/i18n";
import { getI18nDictionary } from "@/lib/i18n/dictionaries";
import { getRequestLocale } from "@/lib/i18n/server";

import "./globals.css";

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  preload: false,
});

const playfairDisplay = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  preload: false,
  weight: ["600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-code",
  subsets: ["latin"],
  preload: false,
});

const notoKufiArabic = Noto_Kufi_Arabic({
  variable: "--font-body-ar",
  subsets: ["arabic"],
  preload: false,
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Bibliotheksbücher ausleihen",
    template: "%s | Bibliotheksbücher ausleihen",
  },
  description:
    "Produktionsreifer Next.js-Starter für eine Bibliotheksplattform zur Buchausleihe.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getRequestLocale();
  const dictionary = getI18nDictionary(locale);

  return (
    <html
      lang={dictionary.locale}
      dir={dictionary.dir}
      className={`${inter.variable} ${playfairDisplay.variable} ${geistMono.variable} ${notoKufiArabic.variable} h-full antialiased`}
    >
      <body
        suppressHydrationWarning
        className="bg-background text-foreground min-h-full font-sans"
      >
        <I18nProvider dictionary={dictionary}>{children}</I18nProvider>
      </body>
    </html>
  );
}
