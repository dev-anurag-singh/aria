import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import { ThemeProvider } from '@/components/layout/ThemeProvider'
import './globals.css'

const geist = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Aria',
  description: 'A clean, fast AI chat experience.',
  icons: {
    icon: [
      { url: '/aria-16.png', sizes: '16x16', type: 'image/png' },
      { url: '/aria-32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: { url: '/aria-apple-touch.png' },
    shortcut: '/favicon.ico',
  },
  openGraph: {
    title: 'Aria',
    description: 'A clean, fast AI chat experience.',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Aria',
    description: 'A clean, fast AI chat experience.',
  },
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ede9fe' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geist.variable} h-full overflow-hidden`} suppressHydrationWarning>
      <body className="h-full overflow-hidden antialiased font-sans">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
