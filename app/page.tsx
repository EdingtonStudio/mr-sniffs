import Link from 'next/link';
import Hero from '@/components/Hero';
import ProductGrid from '@/components/ProductGrid';
import AddToCartButton from '@/components/AddToCartButton';
import NewsletterForm from '@/components/NewsletterForm';
import { shopifyFetch, mapProduct, type Product } from '@/lib/shopify';
import { PRODUCTS_QUERY, PRODUCT_BY_HANDLE_QUERY } from '@/lib/queries';
import styles from './page.module.css';

export const revalidate = 60;

export default async function HomePage() {
  const [productsData, bundleData] = await Promise.all([
    shopifyFetch<{ products: { nodes: unknown[] } }>({ query: PRODUCTS_QUERY, variables: { first: 20 } }),
    shopifyFetch<{ product: unknown }>({ query: PRODUCT_BY_HANDLE_QUERY, variables: { handle: 'duo-bundle' } }).catch(
      () => ({ product: null })
    ),
  ]);

  const products: Product[] = productsData.products.nodes.map(mapProduct).filter((p) => p.handle !== 'duo-bundle');
  const bundle: Product | null = bundleData.product ? mapProduct(bundleData.product) : null;

  return (
    <>
      <Hero />

      <section className={styles.featured}>
        <header className={styles.featuredHeader}>
          <p className={styles.kicker}>The whole line</p>
          <h2 className={styles.featuredTitle}>Pick Your Whiff</h2>
        </header>
        <ProductGrid products={products} />
      </section>

      {bundle ? (
        <section className={styles.bundle}>
          <div className={styles.bundleInner}>
            <div className={styles.bundleCopy}>
              <p className={styles.kicker}>Can&rsquo;t decide?</p>
              <h2 className={styles.bundleTitle}>Take Both. Decide Later.</h2>
              <p className={styles.bundleBody}>{bundle.description}</p>
            </div>
            <AddToCartButton variantId={bundle.variantId} className={styles.bundleCta} />
          </div>
        </section>
      ) : null}

      <section className={styles.newsletter}>
        <p className={styles.kicker}>Stay in the loop</p>
        <h2 className={styles.newsletterTitle}>Don&rsquo;t Miss The Next Scent.</h2>
        <NewsletterForm className={styles.newsletterForm} />
      </section>

      <section className={styles.smellTestBand}>
        <p className={styles.smellTestCopy}>Still not sure which one&rsquo;s yours?</p>
        <Link href="/smell-test" className={styles.smellTestCta}>
          Take The Smell Test →
        </Link>
      </section>
    </>
  );
}
