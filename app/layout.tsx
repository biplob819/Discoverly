import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { StackProvider, StackTheme } from "@stackframe/stack";
import { stackServerApp } from "@/stack";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Discoverly - Discover & Launch Amazing Products",
  description: "A modern product discovery and launch platform for builders, founders, and early-stage startups. Get discovered by the right audience.",
  keywords: ["product launch", "startup", "product discovery", "indie hackers", "saas"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <StackProvider app={stackServerApp}>
          <StackTheme>
            {children}
          </StackTheme>
        </StackProvider>
      </body>
    </html>
  );
}

