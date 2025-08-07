import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "444Nomizo",
  description: "444Nomizo",
};

const footerLinks = [
  {
    label: "Terms and Conditions",
    href: "/terms-and-conditions",
  },
  {
    label: "Privacy Policy",
    href: "/privacy-policy",
  },
  {
    label: "Return and Refund Policy",
    href: "/return-and-refund-policy",
  },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="tracking-wider antialiased bg-stone-800 text-amber-100 font-sans p-4">
        <header className="flex flex-col justify-center items-center w-full py-4 mb-8">
          <Link href="/" className="flex flex-col justify-center items-center">
            <h1 className="text-3xl tracking-widest font-bold uppercase italic">
              Nomizo
            </h1>
            <p className="text-sm mt-2 -ml-2 tracking-widest uppercase italic">
              Here to takeover
            </p>
          </Link>
        </header>
        {children}
        <footer className="flex flex-col justify-center items-center w-full py-4 gap-4 mt-8">
          <p className="text-sm text-center">
            K Cast, E-10/7915/1A, STREET NO-2, DHANRAJ NAGAR, BAHADUE KE ROAD,
            PINCODE - 141008 LUDHIANA
          </p>
          <div className="flex gap-8 flex-col sm:flex-row justify-center items-center">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="underline underline-offset-6 decoration-1 hover:decoration-2 transition-all"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </footer>
      </body>
    </html>
  );
}
