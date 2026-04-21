import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap"
});

export const metadata: Metadata = {
  title: "Agenda Iglesia",
  description: "Calendario y tareas para líderes y pastores",
  manifest: "/manifest.webmanifest",
  themeColor: "#4f8f73",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Agenda Iglesia"
  },
  icons: {
    icon: "/icon",
    apple: "/apple-icon"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.variable}>{children}</body>
    </html>
  );
}
