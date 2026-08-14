'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/cart-context';
import styles from './Nav.module.css';

const LINKS = [
  { href: '/shop', label: 'Shop' },
  { href: '/smell-test', label: 'Smell Test' },
  { href: '/about', label: 'About' },
];

export default function Nav() {
  const { cart, openCart } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo} aria-label="Mr. Sniff's — home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/MrSniffs-Logo-white.svg" alt="Mr. Sniff's" />
        </Link>

        <div className={styles.right}>
          <div className={styles.links}>
            {LINKS.map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
          </div>

          <button
            className={styles.cart}
            type="button"
            aria-label={`Open cart (${cart.totalQuantity} ${cart.totalQuantity === 1 ? 'item' : 'items'})`}
            onClick={() => {
              setMenuOpen(false);
              openCart();
            }}
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

          <button
            className={styles.menuBtn}
            type="button"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <svg
              viewBox="0 0 24 24"
              width="22"
              height="22"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              {menuOpen ? (
                <>
                  <path d="M5 5l14 14" />
                  <path d="M19 5L5 19" />
                </>
              ) : (
                <>
                  <path d="M3.5 6.5h17" />
                  <path d="M3.5 12h17" />
                  <path d="M3.5 17.5h17" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen ? (
        <div className={styles.menu}>
          {LINKS.map((link) => (
            <Link key={link.href} href={link.href} className={styles.menuLink} onClick={() => setMenuOpen(false)}>
              {link.label}
            </Link>
          ))}
        </div>
      ) : null}
    </nav>
  );
}
