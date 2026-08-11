// Mr. Sniff's — Shopify Storefront API client
//
// Reads credentials from env (.env.local):
//   NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN     e.g. mr-sniffs.myshopify.com
//   NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN  public Storefront API access token
//                                         (from the Headless channel storefront)
//
// The public token is sent as the X-Shopify-Storefront-Access-Token header and
// is safe to expose client-side — that's why it's a NEXT_PUBLIC_ var.

const SHOPIFY_STORE_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const SHOPIFY_STOREFRONT_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN;

// Bump when adopting newer Storefront API features.
export const STOREFRONT_API_VERSION = '2025-10';

const endpoint = SHOPIFY_STORE_DOMAIN
  ? `https://${SHOPIFY_STORE_DOMAIN}/api/${STOREFRONT_API_VERSION}/graphql.json`
  : undefined;

export interface ShopifyFetchParams<TVariables> {
  query: string;
  variables?: TVariables;
  /** ISR revalidation window in seconds. Default 60. Pass 0 to opt out of caching. */
  revalidate?: number;
  /** Force a Next.js cache mode, overriding `revalidate`. */
  cache?: RequestCache;
}

interface GraphQLResponse<TData> {
  data?: TData;
  errors?: Array<{ message: string }>;
}

export class ShopifyError extends Error {
  constructor(message: string, readonly detail?: unknown) {
    super(message);
    this.name = 'ShopifyError';
  }
}

/**
 * Execute a Shopify Storefront API GraphQL request and return typed `data`.
 * Throws `ShopifyError` on missing config, network failure, or GraphQL errors.
 */
export async function shopifyFetch<TData, TVariables = Record<string, unknown>>({
  query,
  variables,
  revalidate = 60,
  cache,
}: ShopifyFetchParams<TVariables>): Promise<TData> {
  if (!endpoint || !SHOPIFY_STOREFRONT_TOKEN) {
    throw new ShopifyError(
      'Missing Shopify env vars. Set NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN and ' +
        'NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN in .env.local.'
    );
  }

  let res: Response;
  try {
    res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_TOKEN,
      },
      body: JSON.stringify({ query, variables }),
      ...(cache ? { cache } : { next: { revalidate } }),
    });
  } catch (err) {
    throw new ShopifyError('Network error talking to Shopify Storefront API.', err);
  }

  if (!res.ok) {
    throw new ShopifyError(
      `Shopify Storefront API returned ${res.status} ${res.statusText}.`,
      await res.text().catch(() => undefined)
    );
  }

  const json = (await res.json()) as GraphQLResponse<TData>;

  if (json.errors?.length) {
    throw new ShopifyError(
      json.errors.map((e) => e.message).join('; '),
      json.errors
    );
  }
  if (!json.data) {
    throw new ShopifyError('Shopify response contained no data.', json);
  }
  return json.data;
}

/* --------------------------------------------------------------------------
   Shared types — the shape our components consume (decoupled from raw GraphQL)
   -------------------------------------------------------------------------- */

export interface Money {
  amount: string;
  currencyCode: string;
}

export interface ShopifyImage {
  url: string;
  altText: string | null;
  width: number;
  height: number;
}

/** Scent-specific data sourced from product metafields (namespace: "custom"). */
export interface ScentMeta {
  notePairing: string | null; // e.g. "Sandalwood + Black Pepper"
  moodTags: string[]; // parsed from a list metafield
  burnTime: string | null;
  flavorColor: string | null; // hex, drives the accent mechanic
}

export interface Product {
  id: string;
  handle: string;
  title: string;
  description: string;
  price: Money;
  featuredImage: ShopifyImage | null;
  images: ShopifyImage[];
  variantId: string | null; // first available variant — used for cart add
  scent: ScentMeta;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
/** Normalize a raw Storefront `Product` node (from PRODUCTS_QUERY / PRODUCT_BY_HANDLE_QUERY) into our Product shape. */
export function mapProduct(node: any): Product {
  const toImage = (n: any): ShopifyImage | null =>
    n ? { url: n.url, altText: n.altText ?? null, width: n.width ?? 0, height: n.height ?? 0 } : null;

  let moodTags: string[] = [];
  const rawMoods = node?.moodTags?.value;
  if (rawMoods) {
    try {
      const parsed = JSON.parse(rawMoods);
      moodTags = Array.isArray(parsed) ? parsed.map(String) : [String(rawMoods)];
    } catch {
      moodTags = [String(rawMoods)];
    }
  }

  return {
    id: node.id,
    handle: node.handle,
    title: node.title,
    description: node.description ?? '',
    price: node?.priceRange?.minVariantPrice ?? { amount: '0', currencyCode: 'USD' },
    featuredImage: toImage(node.featuredImage),
    images: (node?.images?.nodes ?? []).map(toImage).filter(Boolean) as ShopifyImage[],
    variantId: node?.variants?.nodes?.[0]?.id ?? null,
    scent: {
      notePairing: node?.notePairing?.value ?? null,
      moodTags,
      burnTime: node?.burnTime?.value ?? null,
      flavorColor: node?.flavorColor?.value ?? null,
    },
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */
