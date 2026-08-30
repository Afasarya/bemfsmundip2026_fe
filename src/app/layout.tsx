import type { Metadata } from "next";
import "./globals.css";
import SiteChrome from "@/components/layout/SiteChrome";
import SwrProvider from "@/components/providers/SwrProvider";
import { AuthProvider } from "@/components/providers/AuthProvider";

export const metadata: Metadata = {
  title: "BEM FSM UNDIP 2026 | Kabinet Bara Momentum",
  description:
    "Bara Berdaya, Momentum Berkarya. Official website of BEM FSM UNDIP 2026 Kabinet Bara Momentum.",
  keywords: ["BEM FSM UNDIP", "Kabinet Bara Momentum", "BEM 2026", "UNDIP"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="bg-bara-bg-dark font-sans antialiased text-white">
        <AuthProvider>
          <SwrProvider>
            <SiteChrome>{children}</SiteChrome>
          </SwrProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
