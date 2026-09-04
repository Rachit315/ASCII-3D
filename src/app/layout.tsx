import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ASCII 3D — Real-time 3D ASCII Object Studio",
  description:
    "An engineering-grade WebGL studio that extrudes 2D images, SVGs, and models into interactive 3D ASCII objects with Three.js.",
  keywords: ["ASCII 3D", "WebGL", "Three.js", "Vercel Design", "Shader", "ASCII Art"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased overflow-hidden`}
    >
      <body className="h-full w-full overflow-hidden flex flex-col bg-[#FAFAFA] text-[#171717] selection:bg-[#0072F5]/15 selection:text-[#0072F5]">
        {children}
      </body>
    </html>
  );
}
