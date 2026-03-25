export const metadata = {
  title: 'Pam x402 API',
  description: 'Autonomous agent commerce - v2.1',
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
