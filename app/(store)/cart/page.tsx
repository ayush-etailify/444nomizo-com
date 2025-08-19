import CartSummary from "@/modules/cart/components/cart-summary";

export default function CartPage() {
  return (
    <div className="container min-h-screen py-8">
      <div>
        <h1 className="text-center text-xl font-medium uppercase sm:text-left">
          Cart
        </h1>
      </div>
      <CartSummary />
    </div>
  );
}
