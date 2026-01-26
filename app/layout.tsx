import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Official Indian Job Updates | Verified Recruitment Portal",
  description: "The most trusted source for 2026 Batch Indian Government and Private jobs. Official notifications, results, and admit cards fetched 24/7.",
  keywords: "sarkari result, job updates, govt jobs, latest recruitments, official job portal",
  icons: {
    icon: '/favicon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="pt-[100px] min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
