import type { Metadata } from 'next'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Providers } from './providers'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://olivelliott.dev'),
  title: {
    default: 'olivelliott.dev',
    template: '%s · olivelliott.dev',
  },
  description:
    'Olive Elliott — engineer building tools for autonomy, local-first systems, and open-source communities.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <body
        style={{
          backgroundColor: 'var(--color-bg)',
          color: 'var(--color-text-primary)',
        }}
        className="font-sans antialiased"
      >
        <Providers>{children}</Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
