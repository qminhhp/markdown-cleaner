import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MD Base64 Image Cleaner",
  description: "Loại bỏ ảnh base64 khỏi file Markdown",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
