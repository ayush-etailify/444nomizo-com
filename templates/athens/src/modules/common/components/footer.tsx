import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-stone-200 py-8 text-sm">
      <div className="container">
        <div className="text-center">
          K Cast, E-10/7915/1A, STREET NO-2, DHANRAJ NAGAR, BAHADUE KE ROAD,
          PINCODE - 141008 LUDHIANA
        </div>
      </div>
      <div className="container flex flex-col sm:flex-row justify-between gap-4 mt-4">
        <div>
          &copy; {new Date().getFullYear()}{" "}
          <span className="font-semibold tracking-wider uppercase">
            444Nomizo
          </span>{" "}
          - Powered by{" "}
          <Link
            href="https://etailify.io"
            target="_blank"
            className="underline-offset-4 hover:underline"
          >
            Etailify
          </Link>
          .
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
          <Link href="/terms-and-conditions">Terms and Conditions</Link>
          <Link href="/privacy-policy">Privacy Policy</Link>
          <Link href="/returns-and-refund-policy">
            Returns and Refund Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}
