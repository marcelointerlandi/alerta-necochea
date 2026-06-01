import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Informate Necochea — Tu diario digital",
  description: "Noticias locales, nacionales e internacionales de Necochea y la región.",
  icons: {
    icon: '/icon.png',
    shortcut: '/icon.png',
    apple: '/icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        {children}
      </body>
    </html>
  );
}