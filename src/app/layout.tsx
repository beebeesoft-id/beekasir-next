import './globals.css'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
const inter = Inter({ subsets: ['latin'] })


export const metadata = {
  title: 'BeeKasir - Aplikasi Kasir | POS',
  description: 'Beekasir adalah aplikasi kasir gratis untuk android',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3237613258665149" crossorigin="anonymous"></script>
      <body style={{backgroundColor:'#F3F6F9', margin:0}}>{children}</body>
      <Analytics />
    </html>
  )
}
