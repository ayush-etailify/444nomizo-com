import { Button } from "@/lib/ui/button";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function CheckoutConfirmation({
  searchParams,
}: {
  searchParams: Promise<{ id: string }>;
}) {
  const { id } = await searchParams;

  if (!id || !id.startsWith("pay_")) return notFound();

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-2">
      <h1 className="text-2xl font-medium">Your order has been placed!</h1>
      <p className="text-sm text-stone-500">
        Payment ID: <span className="uppercase">{id}</span>
      </p>
      <Button asChild className="mt-4">
        <Link href="/account/orders">View all orders</Link>
      </Button>
    </div>
  );
}
