import AccountHeaderLogout from "@/modules/account/components/account-header-logout";

export default function StoreLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="container min-h-screen py-8">
      <div>
        <div className="flex justify-between items-center">
          <h2 className="text-center text-xl font-medium uppercase sm:text-left">
            Account
          </h2>
          <AccountHeaderLogout />
        </div>
        {children}
      </div>
    </div>
  );
}
