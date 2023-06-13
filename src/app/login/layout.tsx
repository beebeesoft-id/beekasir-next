export default function LoginLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return <html className="h-full bg-white"><body className="h-full">{children}</body></html>
  }