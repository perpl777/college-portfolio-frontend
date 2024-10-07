export const metadata = {
  title: "Портфолио",
  description: "A website that presents students' achievements and portfolios",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
