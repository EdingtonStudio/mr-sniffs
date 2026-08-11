import type { CSSProperties } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/shopify';
import styles from './ProductCard.module.css';

export default function ProductCard({ product }: { product: Product }) {
  const accent = product.scent.flavorColor ?? 'var(--color-iron)';
  const price = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: product.price.currencyCode || 'USD',
    maximumFractionDigits: 0,
  }).format(Number(product.price.amount));

  return (
    <Link
      href={`/products/${product.handle}`}
      className={styles.card}
      style={{ '--card-accent': accent } as CSSProperties}
    >
      <div className={styles.media}>
        <div className={styles.frame}>
          {product.featuredImage ? (
            <Image
              src={product.featuredImage.url}
              alt={product.featuredImage.altText ?? product.title}
              fill
              sizes="(max-width: 820px) 100vw, 45vw"
              className={styles.img}
            />
          ) : (
            <div className={styles.fallback}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/brand/MrSniffs-Mascot-white.svg"
                alt=""
                aria-hidden="true"
                className={styles.fallbackMark}
              />
            </div>
          )}
        </div>
        {/* real packaging tag artwork, keyed by product handle */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className={styles.tag} src={`/brand/tag-${product.handle}.png`} alt={product.title} />
      </div>

      <div className={styles.meta}>
        <div className={styles.info}>
          <h3 className={styles.name}>{product.title}</h3>
          {product.scent.notePairing ? (
            <p className={styles.notes}>{product.scent.notePairing}</p>
          ) : null}
        </div>
        <span className={styles.price}>{price}</span>
      </div>
    </Link>
  );
}
