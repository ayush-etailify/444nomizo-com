export default function RootLegalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="container py-10">{children}</div>;
}
