import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Suvarna Cinefusion — Video Editing, Color Grading & Photography Studio",
  description: "Suvarna Cinefusion is a premier digital studio specializing in cinematic video editing, color grading, videography, and photography for ambitious brands.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Manrope:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
