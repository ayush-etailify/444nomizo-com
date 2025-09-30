"use client";

import { useCart } from "@/lib/hooks/use-cart";
import Link from "next/link";

export default function HeaderCart() {
  const { currentOrder } = useCart();

  return (
    <Link
      data-testid="header__link__cart"
      href="/cart"
      className="flex items-start gap-1"
    >
      <span>Cart</span>
      {currentOrder.products.length > 0 && (
        <span className="text-xs text-stone-500">
          {currentOrder.products.length}
        </span>
      )}
    </Link>
  );
}
