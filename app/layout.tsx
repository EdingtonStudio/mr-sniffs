import type { Metadata } from 'next';
import { Big_Shoulders_Display, Space_Mono, Inter } from 'next/font/google';
import '../styles/globals.css';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import { CartProvider } from '@/lib/cart-context';

const headline = Big_Shoulders_Display({
  subsets: ['latin'],
  variable: '--font-headline',
  display: 'swap',
});

const mono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-mono',
  display: 'swap',
});

const body = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Mr. Sniff's",
  description: "Mr. Sniff's incense.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${headline.variable} ${mono.variable} ${body.variable}`}
    >
      <body>
        <CartProvider>
          <Nav />
          <main>{children}</main>
          <Footer />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
