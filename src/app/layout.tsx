import { HomeIcon } from "@heroicons/react/16/solid";
import type { Metadata } from "next";
import Link from "next/link";
import ThemeSelector from "../components/ThemeSelector";
import { ThemeProvider } from "../contexts/ThemeContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "Garden Walk",
  description:
    "A privacy-first conversation starter tool for complex personal topics",
};

/** Inline script to set data-theme before first paint, preventing FOWT. */
const THEME_INIT_SCRIPT = `try{var t=localStorage.getItem('garden-walk-theme');if(t&&['spring','summer','autumn','winter'].indexOf(t)!==-1){document.documentElement.setAttribute('data-theme',t)}}catch(e){}`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body>
        <ThemeProvider>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-th-primary focus:px-4 focus:py-2 focus:text-white"
          >
            Skip to main content
          </a>
          <header className="app-header">
            <div className="app-header-inner">
              <div className="flex flex-1 items-center">
                <Link
                  href="/"
                  className="flex items-center gap-1.5 text-th-ink-muted hover:text-th-ink"
                  aria-label="Go home"
                  title="Home"
                >
                  <HomeIcon className="h-5 w-5" />
                </Link>
              </div>
              <h1 className="app-brand">Garden Walk</h1>
              <div className="flex flex-1 items-center justify-end">
                <ThemeSelector />
              </div>
            </div>
          </header>
          <div className="app-frame">
            <div className="page-shell">{children}</div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
