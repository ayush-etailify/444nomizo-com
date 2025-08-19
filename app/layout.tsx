import { rubik } from "@/lib/utils/fonts";
import { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "444Nomizo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${rubik.className} tracking-wide text-stone-800 antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
