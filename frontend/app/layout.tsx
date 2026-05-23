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