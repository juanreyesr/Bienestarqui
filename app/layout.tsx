import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bienestar UMG",
  description: "Sistema de gestion de bienestar, apoyo psicologico y formacion preventiva para Arquitectura UMG."
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
