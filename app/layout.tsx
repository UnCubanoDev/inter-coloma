import type { Metadata } from "next";
import "./globals.css";
import TopAppBar from "@/components/TopAppBar";
import BottomNav from "@/components/BottomNav";
import PwaRegister from "@/components/PwaRegister";

const basePath = process.env.PAGES_BASE_URL
  ? new URL(process.env.PAGES_BASE_URL).pathname.replace(/\/$/, "")
  : "/inter-coloma";

export const metadata: Metadata = {
  title: "Liga de Fútbol 2026",
  description: "Sistema de gestión para la Liga de Fútbol 2026 - 13 equipos, todos contra todos",
  applicationName: "Liga 2026",
  appleWebApp: { capable: true, title: "Liga 2026", statusBarStyle: "black-translucent" },
  formatDetection: { telephone: false },
  manifest: `${basePath}/manifest.json`,
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
    <html lang="es">
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
      </body>
    </html>
  );
}
