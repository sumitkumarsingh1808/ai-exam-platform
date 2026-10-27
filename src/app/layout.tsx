import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI-Powered Online Examination Platform (NTA Pattern)",
  description: "Computer Based Test (CBT) portal with Gemini AI question generation, authentic NTA interface, and instant results.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 antialiased selection:bg-blue-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
