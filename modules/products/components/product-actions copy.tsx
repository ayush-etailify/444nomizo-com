"use client";

import { useCartStore } from "@/lib/stores/use-cart-store";
import { Product } from "@/lib/types/products";
import { Button } from "@/lib/ui/button";
import Link from "next/link";

type ProductActionsProps = {
  product: Product;
};

export default function ProductActions({ product }: ProductActionsProps) {
  const { items, addItem } = useCartStore();

  return (
    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
      {items.some((item) => item.product_id === product?.uuid) ? (
        <Button scale="lg" asChild>
          <Link href="/cart">Go to cart</Link>
        </Button>
      ) : (
        <Button
          scale="lg"
          onClick={() => {
            if (
              !product?.uuid ||
              !product?.product_type ||
              !product?.skus[0]?.uuid
            ) {
              return;
            }
            addItem({
              product_id: product.uuid,
              product_type: product.product_type,
              quantity: "1",
              sku_id: product.skus[0].uuid,
              meta: {
                product_name: product.name ?? "",
                selling_price: product.skus[0].selling_price ?? "",
                max_retail_price: product.skus[0].max_retail_price ?? "",
                media_public_url:
                  product.skus[0].media?.[0]?.media_public_url ?? "",
              },
            });
          }}
        >
          Add to cart
        </Button>
      )}
    </div>
  );
}
