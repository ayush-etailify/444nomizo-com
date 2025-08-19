"use client";

import { Product } from "@/lib/types/products";
import { Button } from "@/lib/ui/button";
import { useCart } from "@/lib/hooks/use-cart";

type ProductActionsProps = {
  product: Product;
};

export default function ProductActions({ product }: ProductActionsProps) {
  const { addToCart } = useCart();

  return (
    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Button scale="lg" onClick={() => addToCart(product)}>
        Add to cart
      </Button>
    </div>
  );
}
