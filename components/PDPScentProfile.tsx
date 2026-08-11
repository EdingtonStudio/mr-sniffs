import FlavorTag from './FlavorTag';
import AddToCartButton from './AddToCartButton';
import type { Product } from '@/lib/shopify';
import styles from './PDPScentProfile.module.css';

export default function PDPScentProfile({ product }: { product: Product }) {
  const { scent } = product;

  return (
    <div className={styles.profile}>
      <FlavorTag label={product.title} color={scent.flavorColor ?? undefined} size="lg" className={styles.nameTag} />

      {scent.notePairing ? <p className={styles.notes}>{scent.notePairing}</p> : null}

      {scent.moodTags.length ? (
        <ul className={styles.moods}>
          {scent.moodTags.map((mood) => (
            <li key={mood} className={styles.mood}>
              {mood}
            </li>
          ))}
        </ul>
      ) : null}

      {scent.burnTime ? (
        <p className={styles.burnTime}>
          <span className={styles.burnTimeLabel}>Burn time</span> {scent.burnTime}
        </p>
      ) : null}

      <p className={styles.price}>
        {new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: product.price.currencyCode || 'USD',
          maximumFractionDigits: 0,
        }).format(Number(product.price.amount))}
      </p>

      <AddToCartButton variantId={product.variantId} className={styles.cta} />
    </div>
  );
}
