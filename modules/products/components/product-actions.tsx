"use client";

import { Product } from "@/lib/types/products";
import { Button } from "@/lib/ui/button";

type ProductActionsProps = {
  product: Product;
};

export default function ProductActions({ product }: ProductActionsProps) {
  return (
    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Button scale="lg">Add to cart</Button>
    </div>
  );
}
