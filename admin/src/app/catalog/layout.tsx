export default function CatalogLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="pt-[65px] h-screen bg-gray-50">{children}</div>
  )
}