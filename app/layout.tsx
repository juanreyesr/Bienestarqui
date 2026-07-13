import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bienestar ARQ",
  description: "Prototipo para gestionar bienestar, apoyo psicológico y formación preventiva en Arquitectura."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
