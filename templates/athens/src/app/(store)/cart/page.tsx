import CartSummary from "@/modules/cart/components/cart-summary";

export default function CartPage() {
  return (
    <div className="container min-h-screen py-8">
      <div>
        <h2 className="text-center text-xl font-medium uppercase sm:text-left">
          Cart
        </h2>
      </div>
      <CartSummary />
    </div>
  );
}
