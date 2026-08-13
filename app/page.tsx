import Link from 'next/link';
import Hero from '@/components/Hero';
import EditorialSection from '@/components/EditorialSection';
import ProductGrid from '@/components/ProductGrid';
import NewsletterForm from '@/components/NewsletterForm';
import { shopifyFetch, mapProduct, type Product } from '@/lib/shopify';
import { PRODUCTS_QUERY } from '@/lib/queries';
import styles from './page.module.css';

export const revalidate = 60;

// Merchandising order for the lineup; anything new lands after these.
const LINEUP_ORDER = ['burn-notice-palo-santo', 'bonfire-agarwood', 'duo-bundle'];

export default async function HomePage() {
  const productsData = await shopifyFetch<{ products: { nodes: unknown[] } }>({
    query: PRODUCTS_QUERY,
    variables: { first: 20 },
  });

  const rank = (p: Product) => {
    const i = LINEUP_ORDER.indexOf(p.handle);
    return i === -1 ? LINEUP_ORDER.length : i;
  };
  const products: Product[] = productsData.products.nodes.map(mapProduct).sort((a, b) => rank(a) - rank(b));

  return (
    <>
      <Hero />

      <div className={styles.index}>
        <EditorialSection
          num="01/"
          label="The Lineup"
          note={`${String(products.length).padStart(2, '0')} Products`}
          defaultOpen
        >
          <ProductGrid products={products} />
        </EditorialSection>

        <EditorialSection num="02/" label="The Smell Test" note="4 Questions">
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

        <EditorialSection num="03/" label="Stay In The Loop" note="Newsletter">
          <div className={styles.newsletterInner}>
            <p className={styles.newsletterCopy}>Don&rsquo;t miss the next scent.</p>
            <NewsletterForm className={styles.newsletterForm} />
          </div>
        </EditorialSection>
      </div>
    </>
  );
}
