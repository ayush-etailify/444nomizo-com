import OrdersContainer from "@/modules/account/components/orders-container";

export default function OrdersPage() {
  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium capitalize">My orders</h3>
      <OrdersContainer />
    </div>
  );
}
