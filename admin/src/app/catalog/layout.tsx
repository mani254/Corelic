export default function CatalogLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="mx-10 max-w-[1300px] pt-[65px] h-screen">{children}</div>
  )
}