"use client";

import { useCartStore } from "@/lib/stores/use-cart-store";
import Link from "next/link";

export default function HeaderCart() {
  const { items } = useCartStore();

  return (
    <Link href="/cart" className="flex items-start gap-1">
      <span>Cart</span>
      {items.length > 0 && (
        <span className="text-xs text-stone-500"> {items.length}</span>
      )}
    </Link>
  );
}
