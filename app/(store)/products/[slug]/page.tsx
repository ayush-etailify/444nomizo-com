import { getProductBySlugQueryFn } from "@/data/products";
import { PageProps } from "@/lib/types/common";
import { calculateDiscountPercentage } from "@/lib/utils/discounts";
import { readPrice } from "@/lib/utils/text-format";
import ProductActions from "@/modules/products/components/product-actions";
import { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { slug } = await props.params;
  const product = await getProductBySlugQueryFn(slug);

  if (!product) notFound();

  return {
    title: `${product.name} | 444Nomizo`,
    description: `${product.name}`,
    openGraph: {
      title: `${product.name} | 444Nomizo`,
      description: `${product.name}`,
      images: product.skus[0]?.media?.[0]?.media_public_url
        ? [product.skus[0]?.media?.[0]?.media_public_url]
        : [],
    },
  };
}

export default async function ProductsDetailPage(props: PageProps) {
  const { slug } = await props.params;
  const product = await getProductBySlugQueryFn(slug);

  return (
    <div className="container min-h-screen py-8">
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        <div id="__product-image" className="grid grid-cols-5 gap-3 sm:gap-4">
          <div
            id="__product-image-gallery"
            className="hidden space-y-4 sm:block"
          >
            {product?.skus[0]?.media &&
              product.skus[0].media.length > 0 &&
              product.skus[0].media.map((media) => (
                <div
                  key={media.media_name}
                  className="h-32 overflow-clip rounded-md border border-stone-200"
                >
                  <Image
                    src={media.media_public_url ?? "/img/image-placeholder.png"}
                    alt={media.media_name}
                    width={50}
                    height={50}
                    className="size-full object-cover"
                  />
                </div>
              ))}
          </div>
          <div
            id="__product-image-cover"
            className="col-span-full h-[440px] overflow-clip rounded-md border border-stone-200 sm:col-span-4 sm:h-[680px]"
          >
            <Image
              src={
                product?.skus[0]?.media?.[0]?.media_public_url ??
                "/img/image-placeholder.png"
              }
              alt={product?.name as string}
              width={440}
              height={440}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
        <div id="__product-details">
          <h2 className="text-xl font-medium uppercase sm:text-2xl">
            {product?.name}
          </h2>
          <div className="mt-2 text-sm text-stone-500 uppercase">
            SKU: {product?.skus[0]?.id}
          </div>
          <div className="mt-4">
            <div>
              <span className="text-xl font-semibold">
                {readPrice(product?.skus[0]?.selling_price || "", {
                  format: true,
                })}
              </span>
              <span className="pl-2 text-stone-500 line-through">
                {readPrice(product?.skus[0]?.max_retail_price || "", {
                  format: true,
                })}
              </span>
              <span className="pl-2 text-red-600">
                {`(${calculateDiscountPercentage(
                  product?.skus[0]?.max_retail_price ?? "",
                  product?.skus[0]?.selling_price ?? ""
                )}% OFF)`}
              </span>
            </div>
          </div>
          <div className="mt-4">
            <p className="mt-2 text-sm text-stone-600">
              {product?.description}
            </p>
          </div>
          <ProductActions product={product} />
        </div>
      </div>
      <div className="my-12 grid grid-cols-1 gap-10 sm:my-32 sm:grid-cols-3">
        <div className="flex items-center justify-center gap-2">
          <div className="text-center text-sm">
            <div className="block text-stone-500 uppercase">
              Safe & Contactless
            </div>
            <p className="mt-3 block font-medium">
              Get your order delivered without any physical contact.
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center gap-2">
          <div className="text-center text-sm">
            <div className="block text-stone-500 uppercase">Pay on Arrival</div>
            <p className="mt-3 block font-medium">
              Pay for your order when it arrives at your doorstep.
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center gap-2">
          <div className="text-center text-sm">
            <div className="block text-stone-500 uppercase">Easy Returns</div>
            <p className="mt-3 block font-medium">
              Return your order within 7 days if you are not satisfied.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
