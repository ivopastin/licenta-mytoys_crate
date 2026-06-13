import type { Metadata } from "next";
import { Figtree, Geist, Pacifico } from "next/font/google";
import "./globals.css";
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
  title: "MyToysCrate — Turn Your Plush Toy Idea into Reality",
  description: "Design a custom amigurumi and get an instant downloadable crochet pattern PDF. Choose your animal, size, colors and accessories — MyToysCrate brings your plush toy idea to life.",
  metadataBase: new URL("https://mytoys-crate.com"),
  openGraph: {
    title: "MyToysCrate — Turn Your Plush Toy Idea into Reality",
    description: "Design a custom amigurumi and download a professional crochet pattern PDF instantly.",
    url: "https://mytoys-crate.com",
    siteName: "MyToysCrate",
    images: [
      {
        url: "https://mytoys-crate.com/screenshot-landing-page.webp",
        width: 1200,
        height: 630,
        alt: "MyToysCrate — custom amigurumi crochet patterns",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MyToysCrate — Turn Your Plush Toy Idea into Reality",
    description: "Design a custom amigurumi and download a professional crochet pattern PDF instantly.",
    images: ["https://mytoys-crate.com/screenshot-landing-page.webp"],
  },
  icons: {
    icon: "/favicon.ico",
  },
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
        {children}
      </body>
    </html>
  );
}
