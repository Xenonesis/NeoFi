import './globals.css'
import type { Metadata, Viewport } from 'next'
import { ThemeProvider } from '@/components/theme-provider'
import { AuthProvider } from '@/lib/auth-context'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'

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
  title: 'Budget Buddy - Smart Money Management',
  description: 'Take control of your finances with Budget Buddy, an intuitive financial management tool. Track expenses, set budgets, and achieve your financial goals.',
  applicationName: 'Budget Buddy',
  authors: [{ name: 'Budget Buddy Team' }],
  keywords: ['budget tracking', 'personal finance', 'expense management', 'money management', 'savings goals', 'financial dashboard', 'budget buddy'],
  robots: 'index, follow',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Budget Buddy',
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
    url: 'https://budget-buddy.com',
    title: 'Budget Buddy - Smart Money Management',
    description: 'Take control of your finances with Budget Buddy, an intuitive financial management tool.',
    siteName: 'Budget Buddy',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Budget Buddy - Smart Money Management',
    description: 'Take control of your finances with Budget Buddy, an intuitive financial management tool.',
    creator: '@budgetbuddy',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180' },
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
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="alternate icon" href="/favicon.ico" />
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
          storageKey="budget-buddy-theme"
        >
          <AuthProvider>
            {children}
          </AuthProvider>
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  )
}