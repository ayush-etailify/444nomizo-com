import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-stone-200">
      <div className="container flex h-12 items-center justify-between px-4 uppercase">
        <Link href="/" className="font-semibold">
          444Nomizo
        </Link>
      </div>
    </header>
  );
}
