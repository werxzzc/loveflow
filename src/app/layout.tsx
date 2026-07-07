import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "LoveFlow — Premium Invitation Generator",
  description: "Create beautiful, interactive invitations that make her heart skip a beat.",
  openGraph: {
    title: "LoveFlow",
    description: "Create beautiful, interactive invitations that make her heart skip a beat.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`} suppressHydrationWarning>
      <body className="min-h-screen bg-[#080810] text-white antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
