import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Loader from "@/components/layout/Loader";
import SmoothScroll from "@/components/providers/SmoothScroll";

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
        <Loader>
          <SmoothScroll>
            <Navbar />
            <main className="relative min-h-screen">{children}</main>
            <Footer />
          </SmoothScroll>
        </Loader>
      </body>
    </html>
  );
}