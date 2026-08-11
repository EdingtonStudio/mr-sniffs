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
          <button className={styles.cart} type="button" aria-label="Open cart" onClick={openCart}>
            Cart <span className={styles.count}>({cart.totalQuantity})</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
