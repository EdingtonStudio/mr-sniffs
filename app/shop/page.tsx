import type { Metadata } from 'next';
import ProductGrid from '@/components/ProductGrid';
import { shopifyFetch, mapProduct, type Product } from '@/lib/shopify';
import { PRODUCTS_QUERY } from '@/lib/queries';
import styles from './shop.module.css';

export const metadata: Metadata = {
  title: "Shop · Mr. Sniff's",
  description: "Every Mr. Sniff's scent. Two of them. Zero chill.",
};

export const revalidate = 60;

export default async function ShopPage() {
  const data = await shopifyFetch<{ products: { nodes: unknown[] } }>({
    query: PRODUCTS_QUERY,
    variables: { first: 20 },
  });

  const products: Product[] = data.products.nodes
    .map(mapProduct)
    .filter((p) => p.handle !== 'duo-bundle'); // the bundle is surfaced as an upsell, not a scent card

  return (
    <section className={styles.shop}>
      <header className={styles.header}>
        <p className={styles.kicker}>The whole line</p>
        <h1 className={styles.title}>
          Two Scents.
          <br />
          Zero Chill.
        </h1>
      </header>
      <div className={styles.gridWrap}>
        <ProductGrid products={products} />
      </div>
    </section>
  );
}
