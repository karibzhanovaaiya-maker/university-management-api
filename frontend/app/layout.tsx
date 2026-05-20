import "./globals.css";
import type { Metadata, Viewport } from "next";
import { AuthProvider } from "@/lib/auth";

export const metadata: Metadata = {
  title: "University Management",
  description: "Mobile-first client for the University Management API",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0d1117",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
