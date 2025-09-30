"use client";

import { useCart } from "@/lib/hooks/use-cart";
import { Button } from "@/lib/ui/button";
import { cn } from "@/lib/utils/tailwind";
import {
  Bool,
  Product,
  ProductType,
  ProductVariationGroup,
  ProductVariationGroupOption,
  VariationGroupOption,
} from "@etailify/types";
import { useMemo, useState } from "react";

export type SelectedVariationOptions = {
  [variationGroupId: string]: VariationGroupOption[];
};

const initSelectableVariationGroups = (
  variationGroups: ProductVariationGroup[],
  autoSelectFirst: boolean = true
): SelectedVariationOptions => {
  const result: SelectedVariationOptions = {};

  for (const group of variationGroups) {
    const firstSelectableVariation = group.variations.find(
      (v) => v.selected !== Bool.BOOL_FALSE
    );

    result[group.uuid] =
      autoSelectFirst && firstSelectableVariation
        ? [firstSelectableVariation.variation]
        : [];
  }

  return result;
};

const findMatchingSKU = (
  selectedVariations: VariationGroupOption[],
  skus: Product["skus"]
) => {
  const selectedUUIDs = selectedVariations
    .map((v) => v.uuid)
    .sort()
    .join(",");
  return skus.find((sku) => {
    const skuUUIDs = sku.variations
      .map((v) => v.uuid)
      .sort()
      .join(",");
    return skuUUIDs === selectedUUIDs;
  });
};

export default function ProductActions({ product }: { product: Product }) {
  const { addToCart, asyncState } = useCart();

  const hasVariations =
    product.product_type === ProductType.PRODUCT_TYPE_VARIATION &&
    product.selected_variation_groups.length > 0 &&
    product.skus.length > 1;

  const [selectedVariationsByGroup, setSelectedVariationsByGroup] =
    useState<SelectedVariationOptions | null>(
      hasVariations
        ? initSelectableVariationGroups(product.selected_variation_groups)
        : null
    );

  const selectedVariations = useMemo(() => {
    return selectedVariationsByGroup
      ? Object.values(selectedVariationsByGroup).flat()
      : [];
  }, [selectedVariationsByGroup]);

  const matchingSKU = useMemo(() => {
    if (!selectedVariations.length) return null;
    return findMatchingSKU(selectedVariations, product.skus);
  }, [selectedVariations, product.skus]);

  const invalidVariationMatch = selectedVariations.length > 0 && !matchingSKU;

  const isOptionSelected = (variation: VariationGroupOption) => {
    const groupId = variation.variation_group_id;
    return (
      !!groupId &&
      selectedVariationsByGroup?.[groupId]?.[0]?.uuid === variation.uuid
    );
  };

  const handleVariationOptionSelection = (
    option: ProductVariationGroupOption
  ) => {
    const { variation } = option;
    setSelectedVariationsByGroup((prev) => ({
      ...prev,
      [variation.variation_group_id as string]: [variation],
    }));
  };

  const handleAddToCart = () => {
    if (hasVariations) {
      if (!matchingSKU) return;

      const productWithSelectedSKU = {
        ...product,
        skus: [matchingSKU],
      };
      addToCart(productWithSelectedSKU);
    } else {
      addToCart(product);
    }
  };

  return (
    <div className="mt-6">
      {hasVariations && (
        <div className="space-y-4">
          {product.selected_variation_groups.map((group) => (
            <div key={group.uuid}>
              <p className="text-sm hidden">{group.variation_group_type}</p>
              <div className="flex gap-2">
                {group.variations.map(({ variation, selected }) => (
                  <button
                    key={variation.uuid}
                    disabled={selected === Bool.BOOL_FALSE}
                    onClick={() =>
                      handleVariationOptionSelection({ variation, selected })
                    }
                    className={cn(
                      "rounded-md border min-w-10 border-stone-200 px-2 py-1 text-sm cursor-pointer disabled:cursor-not-allowed disabled:opacity-50",
                      isOptionSelected(variation) &&
                        "border-brand-600 bg-brand-50 text-brand-700"
                    )}
                  >
                    {variation.name}
                  </button>
                ))}
              </div>
            </div>
          ))}
          {selectedVariations.length > 0 && !matchingSKU && (
            <div className="text-red-700 text-sm">
              Sorry, this variation combination is not available.
            </div>
          )}
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Button
          data-testid="pdp__button__add-to-cart"
          scale="lg"
          disabled={invalidVariationMatch}
          loading={asyncState.isCreatingOrder || asyncState.isUpsertingCart}
          onClick={handleAddToCart}
        >
          Add to cart
        </Button>
      </div>
    </div>
  );
}
