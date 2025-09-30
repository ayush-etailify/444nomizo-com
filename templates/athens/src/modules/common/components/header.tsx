import Link from "next/link";
import HeaderCart from "./header-cart";

export default function Header() {
  return (
    <header className="border-b border-stone-200">
      <div className="container flex h-12 items-center justify-between px-4 uppercase">
        <Link href="/" className="font-semibold">
          444Nomizo
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link
            data-testid="header__link__account"
            href="/account"
            className="flex items-start gap-1"
          >
            Account
          </Link>
          <HeaderCart />
        </nav>
      </div>
    </header>
  );
}
