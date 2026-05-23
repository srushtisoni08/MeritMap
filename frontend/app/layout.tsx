import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { CompareProvider } from "@/context/CompareContext";
import Navbar from "@/components/Navbar";
import CompareDrawer from "@/components/CompareDrawer";
import ToastProvider from "@/components/ToastProvider";

export const metadata: Metadata = {
  title: "MeritMap — Find Your Perfect College",
  description:
    "Discover, compare and shortlist the best colleges in India. Search by location, fees, courses and more.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AuthProvider>
          <CompareProvider>
            <ToastProvider>
              <Navbar />
              <main style={{ paddingTop: "64px", minHeight: "calc(100vh - 64px)" }}>
                {children}
              </main>
              <CompareDrawer />
            </ToastProvider>
          </CompareProvider>
        </AuthProvider>
      </body>
    </html>
  );
}