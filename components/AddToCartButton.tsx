'use client';

import { useState } from 'react';
import { useCart } from '@/lib/cart-context';
import styles from './AddToCartButton.module.css';

interface AddToCartButtonProps {
  variantId: string | null;
  className?: string;
}

export default function AddToCartButton({ variantId, className }: AddToCartButtonProps) {
  const { addToCart, isLoading } = useCart();
  const [pending, setPending] = useState(false);

  if (!variantId) {
    return (
      <span className={[styles.btn, styles.disabled, className].filter(Boolean).join(' ')}>
        Sold Out
      </span>
    );
  }

  const busy = isLoading && pending;

  return (
    <button
      type="button"
      className={[styles.btn, className].filter(Boolean).join(' ')}
      disabled={busy}
      onClick={async () => {
        setPending(true);
        try {
          await addToCart(variantId);
        } finally {
          setPending(false);
        }
      }}
    >
      {busy ? 'Adding…' : 'Order Now'}
    </button>
  );
}
