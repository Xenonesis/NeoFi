import './globals.css'
import type { Metadata, Viewport } from 'next'
import { ThemeProvider } from '@/components/theme-provider'
import { AuthProvider } from '@/lib/auth-context'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'
import { PreloadAssets } from '@/components/preload-assets'

// Optimize font loading with display swap
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
})

// Define viewport config separately
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  minimumScale: 1,
  userScalable: true,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#121212' }
  ],
  colorScheme: 'light dark'
}

// Improve metadata for better SEO and performance
export const metadata: Metadata = {
  metadataBase: new URL(process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://neofi.vercel.app'),
  title: 'NeoFi - Smart Money Management',
  description: 'Take control of your finances with NeoFi, an intuitive financial management tool. Track expenses, set budgets, and achieve your financial goals.',
  applicationName: 'NeoFi',
  authors: [{ name: 'NeoFi Team' }],
  keywords: ['budget tracking', 'personal finance', 'expense management', 'money management', 'savings goals', 'financial dashboard', 'budget buddy'],
  robots: 'index, follow',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'NeoFi',
  },
  formatDetection: {
    telephone: false,
    date: false,
    address: false,
    email: false,
    url: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://neofi.vercel.app',
    title: 'NeoFi - Smart Money Management',
    description: 'Take control of your finances with NeoFi, an intuitive financial management tool.',
    siteName: 'NeoFi',
    images: [
      {
        url: '/logo.svg',
        width: 40,
        height: 40,
        alt: 'NeoFi Logo'
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NeoFi - Smart Money Management',
    description: 'Take control of your finances with NeoFi, an intuitive financial management tool.',
    creator: '@neofi',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/favicon.svg', type: 'image/svg+xml' }
    ],
    shortcut: ['/favicon.ico'],
    apple: [{ url: '/apple-icon.png', sizes: '180x180' }],
    other: [
      {
        rel: 'apple-touch-icon',
        url: '/apple-icon.png',
      }
    ]
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no,date=no,address=no,email=no" />
        <meta name="theme-color" media="(prefers-color-scheme: light)" content="#ffffff" />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#121212" />

        {/* Performance optimization meta tags */}
        <meta name="referrer" content="no-referrer-when-downgrade" />
        <meta httpEquiv="Cache-Control" content="max-age=31536000, immutable" />
        <meta httpEquiv="Permissions-Policy" content="interest-cohort=()" />
        <meta name="preload" content="true" />
        <meta name="preconnect" content="true" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      </head>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <script dangerouslySetInnerHTML={{
          __html: `
            if (typeof window !== 'undefined') {
              const currency = localStorage.getItem('budget-currency');
              if (currency === 'hy' || (currency && !['USD', 'EUR', 'GBP', 'JPY', 'CNY', 'INR', 'CAD', 'AUD', 'SGD', 'CHF'].includes(currency))) {
                localStorage.removeItem('budget-currency');
                localStorage.removeItem('user-preferences');
                localStorage.setItem('budget-currency', 'USD');
              }
            }
          `
        }} />
        <ThemeProvider
          defaultTheme="system"
          storageKey="neofi-theme"
        >
          <PreloadAssets />
          <AuthProvider>
            {children}
          </AuthProvider>
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  )
}