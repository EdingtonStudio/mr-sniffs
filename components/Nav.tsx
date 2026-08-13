'use client';

import Link from 'next/link';
import { useCart } from '@/lib/cart-context';
import styles from './Nav.module.css';

export default function Nav() {
  const { cart, openCart } = useCart();

  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo} aria-label="Mr. Sniff's — home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/MrSniffs-Logo-white.svg" alt="Mr. Sniff's" />
        </Link>
        <div className={styles.links}>
          <Link href="/shop">Shop</Link>
          <Link href="/smell-test">Smell Test</Link>
          <Link href="/about" className={styles.about}>About</Link>
          <button
            className={styles.cart}
            type="button"
            aria-label={`Open cart (${cart.totalQuantity} ${cart.totalQuantity === 1 ? 'item' : 'items'})`}
            onClick={openCart}
          >
            <svg
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M4.5 7.5h15L18.3 20H5.7L4.5 7.5Z" />
              <path d="M9 10V5.5a3 3 0 0 1 6 0V10" strokeLinecap="round" />
            </svg>
            {cart.totalQuantity > 0 ? <span className={styles.count}>{cart.totalQuantity}</span> : null}
          </button>
        </div>
      </div>
    </nav>
  );
}
