'use client';

import { useEffect } from 'react';
import type { CSSProperties } from 'react';
import { useCart } from '@/lib/cart-context';
import styles from './CartDrawer.module.css';

function formatMoney(amount: string, currencyCode: string) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode || 'USD',
    maximumFractionDigits: 0,
  }).format(Number(amount));
}

export default function CartDrawer() {
  const { cart, isOpen, isLoading, closeCart, removeLine, addToCart, duoBundle } = useCart();

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, closeCart]);

  const handles = new Set(cart.lines.map((l) => l.handle));
  const hasBundle = handles.has('duo-bundle');
  const hasBothScents = handles.has('bonfire-agarwood') && handles.has('burn-notice-palo-santo');
  const showBundleUpsell = duoBundle?.variantId && !hasBundle && !hasBothScents && cart.lines.length > 0;

  return (
    <>
      <div
        className={[styles.backdrop, isOpen ? styles.backdropOpen : ''].join(' ')}
        onClick={closeCart}
        aria-hidden="true"
      />
      <aside
        className={[styles.drawer, isOpen ? styles.drawerOpen : ''].join(' ')}
        aria-label="Cart"
        aria-hidden={!isOpen}
      >
        <header className={styles.header}>
          <h2 className={styles.title}>{cart.lines.length ? 'Your Haul' : "Mr. Sniff's"}</h2>
          <button type="button" className={styles.close} onClick={closeCart} aria-label="Close cart">
            ✕
          </button>
        </header>

        {cart.lines.length === 0 ? (
          <div className={styles.empty}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/MrSniffs-Mascot-white.svg" alt="" aria-hidden="true" className={styles.mascot} />
            <p className={styles.emptyCopy}>Nothing here yet. Mr. Sniff is disappointed but not surprised.</p>
            <a href="/shop" className={styles.emptyLink}>
              Go pick a fight with your nose →
            </a>
          </div>
        ) : (
          <>
            <ul className={styles.lines}>
              {cart.lines.map((line) => (
                <li
                  key={line.id}
                  className={styles.line}
                  style={{ '--line-accent': line.flavorColor ?? 'var(--color-iron)' } as CSSProperties}
                >
                  <div className={styles.lineMedia}>
                    {line.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={line.image.url} alt={line.image.altText ?? line.title} className={styles.lineImg} />
                    ) : null}
                  </div>
                  <div className={styles.lineInfo}>
                    <span className={styles.lineName}>{line.title}</span>
                    <span className={styles.lineMeta}>
                      Qty {line.quantity} · {formatMoney(line.price.amount, line.price.currencyCode)}
                    </span>
                  </div>
                  <button
                    type="button"
                    className={styles.remove}
                    onClick={() => removeLine(line.id)}
                    disabled={isLoading}
                    aria-label={`Remove ${line.title}`}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>

            {showBundleUpsell ? (
              <div className={styles.upsell}>
                <p className={styles.upsellCopy}>
                  Not sure? The Duo Bundle gets you both scents. Stop overthinking it.
                </p>
                <button
                  type="button"
                  className={styles.upsellBtn}
                  disabled={isLoading}
                  onClick={() => duoBundle?.variantId && addToCart(duoBundle.variantId)}
                >
                  Add the Duo Bundle
                </button>
              </div>
            ) : null}

            <footer className={styles.footer}>
              {cart.subtotal ? (
                <div className={styles.subtotalRow}>
                  <span>Subtotal</span>
                  <span>{formatMoney(cart.subtotal.amount, cart.subtotal.currencyCode)}</span>
                </div>
              ) : null}
              <a
                href={cart.checkoutUrl ?? '#'}
                className={styles.checkout}
                aria-disabled={!cart.checkoutUrl}
              >
                Order Now
              </a>
            </footer>
          </>
        )}
      </aside>
    </>
  );
}
