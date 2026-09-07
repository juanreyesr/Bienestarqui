import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bienestar UMG | Facultad de Arquitectura",
  description: "Plataforma institucional de bienestar, acompañamiento y formación preventiva para la Facultad de Arquitectura UMG."
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
