"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Loader from "@/components/layout/Loader";
import SmoothScroll from "@/components/providers/SmoothScroll";

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) {
    return <>{children}</>;
  }

  return (
    <Loader>
      <SmoothScroll>
        <Navbar />
        <main className="relative min-h-screen">{children}</main>
        <Footer />
      </SmoothScroll>
    </Loader>
  );
}
