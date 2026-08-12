// Mr. Sniff's — LOCAL DEV FIXTURES ONLY.
//
// Active only when NEXT_PUBLIC_SHOPIFY_MOCK=1 (never set in production).
// Lets the site render in sandboxes where egress to the Shopify Storefront
// API is blocked. Shapes mirror the real Storefront responses consumed by
// mapProduct()/normalizeCart(); handles/colors match the live catalog.
// All copy/prices here are placeholder fixture values, not brand facts.

const IMG = (url: string) => ({ url, altText: null, width: 1200, height: 1200 });

const MOCK_PRODUCTS: Record<string, unknown> = {
  'burn-notice-palo-santo': {
    id: 'gid://mock/Product/1',
    handle: 'burn-notice-palo-santo',
    title: 'Burn Notice · Palo Santo Incense',
    description:
      'Placeholder fixture description for local development. Real copy comes from Shopify.',
    priceRange: { minVariantPrice: { amount: '18.0', currencyCode: 'USD' } },
    featuredImage: IMG('/photos/card-burn-notice.jpg'),
    images: { nodes: [IMG('/photos/card-burn-notice.jpg'), IMG('/photos/hero-burn-notice.jpg')] },
    variants: { nodes: [{ id: 'gid://mock/ProductVariant/1', availableForSale: true }] },
    notePairing: { value: 'Sandalwood + Black Pepper' },
    moodTags: { value: '["Bold","Loud"]' },
    burnTime: { value: '≈50 min / stick' },
    flavorColor: { value: '#E06666' },
  },
  'bonfire-agarwood': {
    id: 'gid://mock/Product/2',
    handle: 'bonfire-agarwood',
    title: 'Bon Fire · Agarwood Incense',
    description:
      'Placeholder fixture description for local development. Real copy comes from Shopify.',
    priceRange: { minVariantPrice: { amount: '18.0', currencyCode: 'USD' } },
    featuredImage: IMG('/photos/card-happy-ending.jpg'),
    images: { nodes: [IMG('/photos/card-happy-ending.jpg')] },
    variants: { nodes: [{ id: 'gid://mock/ProductVariant/2', availableForSale: true }] },
    notePairing: { value: 'Agarwood' },
    moodTags: { value: '["Warm","Slow"]' },
    burnTime: { value: '≈50 min / stick' },
    flavorColor: { value: '#9A6B3F' },
  },
  'duo-bundle': {
    id: 'gid://mock/Product/3',
    handle: 'duo-bundle',
    title: 'The Duo Bundle',
    description:
      'Placeholder fixture description for local development. Real copy comes from Shopify.',
    priceRange: { minVariantPrice: { amount: '32.0', currencyCode: 'USD' } },
    featuredImage: IMG('/photos/card-burn-notice.jpg'),
    images: { nodes: [IMG('/photos/card-burn-notice.jpg')] },
    variants: { nodes: [{ id: 'gid://mock/ProductVariant/3', availableForSale: true }] },
    notePairing: { value: null },
    moodTags: { value: null },
    burnTime: { value: null },
    flavorColor: { value: null },
  },
};

/* ------------------------- in-memory mock cart --------------------------- */

interface MockLine {
  id: string;
  quantity: number;
  merchandiseId: string;
}

let mockLines: MockLine[] = [];
let lineSeq = 0;

function variantToProduct(variantId: string) {
  return Object.values(MOCK_PRODUCTS).find(
    (p) => (p as { variants: { nodes: Array<{ id: string }> } }).variants.nodes[0].id === variantId
  ) as Record<string, any> | undefined; // eslint-disable-line @typescript-eslint/no-explicit-any
}

function cartPayload() {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const nodes = mockLines.map((l) => {
    const p: any = variantToProduct(l.merchandiseId);
    return {
      id: l.id,
      quantity: l.quantity,
      merchandise: {
        id: l.merchandiseId,
        title: 'Default',
        price: p?.priceRange.minVariantPrice ?? { amount: '0', currencyCode: 'USD' },
        image: p?.featuredImage ?? null,
        product: p
          ? { handle: p.handle, title: p.title, flavorColor: p.flavorColor }
          : null,
      },
    };
  });
  const subtotal = nodes.reduce(
    (sum, n) => sum + Number(n.merchandise.price.amount) * n.quantity,
    0
  );
  /* eslint-enable @typescript-eslint/no-explicit-any */
  return {
    id: 'gid://mock/Cart/1',
    checkoutUrl: '#mock-checkout',
    totalQuantity: nodes.reduce((sum, n) => sum + n.quantity, 0),
    cost: {
      subtotalAmount: { amount: String(subtotal), currencyCode: 'USD' },
      totalAmount: { amount: String(subtotal), currencyCode: 'USD' },
    },
    lines: { nodes },
  };
}

function addLines(lines: Array<{ merchandiseId: string; quantity?: number }>) {
  for (const line of lines ?? []) {
    const existing = mockLines.find((l) => l.merchandiseId === line.merchandiseId);
    if (existing) existing.quantity += line.quantity ?? 1;
    else mockLines.push({ id: `mock-line-${++lineSeq}`, quantity: line.quantity ?? 1, merchandiseId: line.merchandiseId });
  }
}

/* ------------------------------ dispatcher ------------------------------- */

/** Resolve a Storefront GraphQL document against the fixtures. */
export function mockShopifyFetch<TData>(query: string, variables?: unknown): TData {
  const vars = (variables ?? {}) as Record<string, unknown>;

  if (query.includes('query Products')) {
    return { products: { nodes: Object.values(MOCK_PRODUCTS) } } as TData;
  }
  if (query.includes('query ProductByHandle')) {
    return { product: MOCK_PRODUCTS[String(vars.handle)] ?? null } as TData;
  }
  if (query.includes('query Cart')) {
    return { cart: cartPayload() } as TData;
  }
  if (query.includes('mutation CartCreate')) {
    mockLines = [];
    addLines(vars.lines as Array<{ merchandiseId: string; quantity?: number }>);
    return { cartCreate: { cart: cartPayload(), userErrors: [] } } as TData;
  }
  if (query.includes('mutation CartLinesAdd')) {
    addLines(vars.lines as Array<{ merchandiseId: string; quantity?: number }>);
    return { cartLinesAdd: { cart: cartPayload(), userErrors: [] } } as TData;
  }
  if (query.includes('mutation CartLinesUpdate')) {
    for (const line of (vars.lines ?? []) as Array<{ id: string; quantity: number }>) {
      const target = mockLines.find((l) => l.id === line.id);
      if (target) target.quantity = line.quantity;
    }
    mockLines = mockLines.filter((l) => l.quantity > 0);
    return { cartLinesUpdate: { cart: cartPayload(), userErrors: [] } } as TData;
  }
  if (query.includes('mutation CartLinesRemove')) {
    const ids = new Set((vars.lineIds ?? []) as string[]);
    mockLines = mockLines.filter((l) => !ids.has(l.id));
    return { cartLinesRemove: { cart: cartPayload(), userErrors: [] } } as TData;
  }

  throw new Error(`mockShopifyFetch: unhandled query.\n${query.slice(0, 120)}`);
}
