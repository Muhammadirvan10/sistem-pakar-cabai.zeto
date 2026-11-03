import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "CabaiCare – Sistem Pakar & Deteksi Kondisi Tanaman Cabai",
  description:
    "Sistem Pakar Forward Chaining dan AI Computer Vision untuk deteksi penyakit tanaman, daun, kebusukan buah, dan kematangan cabai.",
  keywords: [
    "Sistem Pakar Cabai",
    "CabaiCare",
    "Forward Chaining Cabai",
    "Penyakit Cabai",
    "Antraknosa",
    "Gemini Virus",
    "Layu Bakteri",
    "Computer Vision Pertanian",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="flex flex-col min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

