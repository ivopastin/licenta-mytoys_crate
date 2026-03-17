import type { Metadata } from "next";
import { Figtree, Geist, Pacifico } from "next/font/google";
import "./globals.css";
import AppShell from "./components/AppShell";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
});

const pacifico = Pacifico({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pacifico",
});

export const metadata: Metadata = {
  title: "MyToys Crate",
  description: "This is where your plush toy idea come to life.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body
        className={`${figtree.variable} ${figtree.className} ${pacifico.variable} antialiased bg-white`}
      >
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
