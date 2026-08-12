import Link from 'next/link';
import Hero from '@/components/Hero';
import EditorialSection from '@/components/EditorialSection';
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

      <div className={styles.index}>
        <EditorialSection num="01/" label="The Lineup" note={`${products.length} Scents`} defaultOpen>
          <ProductGrid products={products} />
        </EditorialSection>

        {bundle ? (
          <EditorialSection num="02/" label="The Duo Bundle" note="Both Scents">
            <div className={styles.bundleInner}>
              <div className={styles.bundleCopy}>
                <h3 className={styles.bundleTitle}>Take Both. Decide Later.</h3>
                <p className={styles.bundleBody}>{bundle.description}</p>
              </div>
              <AddToCartButton variantId={bundle.variantId} className={styles.bundleCta} />
            </div>
          </EditorialSection>
        ) : null}

        <EditorialSection num={bundle ? '03/' : '02/'} label="The Smell Test" note="4 Questions">
          <div className={styles.smellTestInner}>
            <p className={styles.smellTestCopy}>
              Still not sure which one&rsquo;s yours? Four questions, no accounts, no email gate —
              one winner for your nose.
            </p>
            <Link href="/smell-test" className={styles.smellTestCta}>
              Take The Smell Test →
            </Link>
          </div>
        </EditorialSection>

        <EditorialSection num={bundle ? '04/' : '03/'} label="Stay In The Loop" note="Newsletter">
          <div className={styles.newsletterInner}>
            <p className={styles.newsletterCopy}>Don&rsquo;t miss the next scent.</p>
            <NewsletterForm className={styles.newsletterForm} />
          </div>
        </EditorialSection>
      </div>
    </>
  );
}
