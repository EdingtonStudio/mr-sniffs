import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import PDPScentProfile from '@/components/PDPScentProfile';
import { shopifyFetch, mapProduct, type Product } from '@/lib/shopify';
import { PRODUCT_BY_HANDLE_QUERY, PRODUCTS_QUERY } from '@/lib/queries';
import styles from './page.module.css';

export const revalidate = 60;

async function getProduct(handle: string): Promise<Product | null> {
  const data = await shopifyFetch<{ product: unknown }>({
    query: PRODUCT_BY_HANDLE_QUERY,
    variables: { handle },
  });
  return data.product ? mapProduct(data.product) : null;
}

async function getOtherScent(handle: string): Promise<Product | null> {
  const data = await shopifyFetch<{ products: { nodes: unknown[] } }>({
    query: PRODUCTS_QUERY,
    variables: { first: 20 },
  });
  const other = data.products.nodes
    .map(mapProduct)
    .find((p) => p.handle !== handle && p.handle !== 'duo-bundle');
  return other ?? null;
}

/** Falls back to real product photography in /public when Shopify has no images yet. */
function galleryFor(product: Product): { url: string; alt: string }[] {
  if (product.images.length) {
    return product.images.map((img) => ({ url: img.url, alt: img.altText ?? product.title }));
  }
  return [
    { url: `/photos/card-${product.handle}.jpg`, alt: `${product.title} incense, dramatic shot` },
    { url: `/brand/tag-${product.handle}.png`, alt: `${product.title} packaging tag` },
  ];
}

export async function generateMetadata({
  params,
}: {
  params: { handle: string };
}): Promise<Metadata> {
  const product = await getProduct(params.handle);
  if (!product) return { title: "Not found — Mr. Sniff's" };
  return {
    title: `${product.title} — Mr. Sniff's`,
    description: product.description || `${product.title}, handcrafted incense from Mr. Sniff's.`,
  };
}

export default async function ProductPage({ params }: { params: { handle: string } }) {
  const product = await getProduct(params.handle);
  if (!product) notFound();

  const otherScent = await getOtherScent(params.handle);
  const gallery = galleryFor(product);
  const accent = product.scent.flavorColor ?? undefined;

  return (
    <article className={styles.pdp} style={accent ? ({ '--color-accent': accent } as React.CSSProperties) : undefined}>
      <div className={styles.top}>
        <div className={styles.gallery}>
          {gallery.map((img, i) => (
            <div key={img.url} className={i === 1 ? styles.frameOffset : styles.frame}>
              <Image src={img.url} alt={img.alt} fill sizes="(max-width: 900px) 100vw, 50vw" className={styles.img} />
            </div>
          ))}
        </div>
        <PDPScentProfile product={product} />
      </div>

      {otherScent ? (
        <section className={styles.otherOne}>
          <p className={styles.otherKicker}>The Other One</p>
          <Link href={`/products/${otherScent.handle}`} className={styles.otherCard}>
            <span className={styles.otherName}>{otherScent.title}</span>
            {otherScent.scent.notePairing ? (
              <span className={styles.otherNotes}>{otherScent.scent.notePairing}</span>
            ) : null}
            <span className={styles.otherArrow} aria-hidden="true">
              →
            </span>
          </Link>
        </section>
      ) : null}
    </article>
  );
}
