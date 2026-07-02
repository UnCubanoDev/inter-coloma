import type { Metadata } from "next";
import { Oswald, Hanken_Grotesk } from "next/font/google";
import "./globals.css";
import TopAppBar from "@/components/TopAppBar";
import BottomNav from "@/components/BottomNav";
import PwaRegister from "@/components/PwaRegister";
import { Toaster } from "sonner";

const oswald = Oswald({ subsets: ["latin"], display: "swap", variable: "--font-oswald" });
const hanken = Hanken_Grotesk({ subsets: ["latin"], display: "swap", variable: "--font-hanken" });

const basePath = process.env.PAGES_BASE_URL
  ? new URL(process.env.PAGES_BASE_URL).pathname.replace(/\/$/, "")
  : "/inter-coloma";

const siteUrl = process.env.PAGES_BASE_URL || "https://uncubanodev.github.io/inter-coloma";

export const metadata: Metadata = {
  title: { default: "InterColoma 2026", template: "%s · InterColoma" },
  description: "Torneo de fútbol InterColoma 2026 - 13 equipos, todos contra todos",
  applicationName: "InterColoma",
  appleWebApp: { capable: true, title: "InterColoma", statusBarStyle: "black-translucent" },
  formatDetection: { telephone: false },
  manifest: `${basePath}/manifest.webmanifest`,
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: "website",
    siteName: "InterColoma",
    title: "InterColoma 2026",
    description: "Torneo de fútbol InterColoma 2026 - 13 equipos, todos contra todos",
    url: siteUrl,
    locale: "es_ES",
  },
  twitter: {
    card: "summary_large_image",
    title: "InterColoma 2026",
    description: "Torneo de fútbol InterColoma 2026 - 13 equipos, todos contra todos",
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "msapplication-TileColor": "#00450d",
    "theme-color": "#00450d",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${oswald.variable} ${hanken.variable}`}>
      <head>
        <link rel="icon" type="image/svg+xml" href={`${basePath}/icons/icon-192.svg`} />
        <link rel="apple-touch-icon" href={`${basePath}/icons/icon-192.svg`} />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no" />
      </head>
      <body className="flex flex-col h-dvh overflow-hidden bg-[#fcf9f8] dark:bg-[#1b1c1c] text-[#1b1c1c] dark:text-[#e3e3e3] font-sans antialiased safe-area-top">
        <TopAppBar />
        <main className="flex-1 overflow-y-auto">{children}</main>
        <BottomNav />
        <PwaRegister />
        <Toaster position="top-center" richColors closeButton />
      </body>
    </html>
  );
}
