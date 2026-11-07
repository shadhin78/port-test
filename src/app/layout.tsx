import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";

import "./globals.css";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ThemeScript } from "@/components/ui/theme-script";
import { profile } from "@/config/profile";
import { defaultTitle, pageSeo, titleTemplate } from "@/config/seo";
import { siteConfig } from "@/config/site";
import { robotsFor } from "@/lib/metadata";

// Self-hosted variable fonts (SIL Open Font License, see ./fonts/LICENSE-Geist.txt).
const geistSans = localFont({
  src: "./fonts/Geist-Variable.woff2",
  variable: "--font-geist-sans",
  weight: "100 900",
  display: "swap",
});

// Monospace is used selectively for small technical details, so it is not preloaded.
const geistMono = localFont({
  src: "./fonts/GeistMono-Variable.woff2",
  variable: "--font-geist-mono",
  weight: "100 900",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: defaultTitle, template: titleTemplate },
  description: pageSeo.home.description,
  applicationName: siteConfig.title,
  authors: [{ name: profile.name }],
  creator: profile.name,
  robots: robotsFor(),
  openGraph: {
    type: "website",
    siteName: profile.name,
    locale: siteConfig.ogLocale,
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: siteConfig.themeColor,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang={siteConfig.language}
      // The theme script sets data-theme before hydration, so React must not warn about it.
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <head>
        <ThemeScript />
      </head>
      <body className="flex min-h-dvh flex-col antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2.5 focus:text-sm focus:font-medium focus:text-on-primary"
        >
          Skip to main content
        </a>
        <SiteHeader />
        <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
