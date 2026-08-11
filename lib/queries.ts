// Mr. Sniff's — Shopify Storefront GraphQL documents
//
// Scent-specific data lives in product metafields under the "custom" namespace:
//   custom.note_pairing      (single_line_text)   e.g. "Sandalwood + Black Pepper"
//   custom.mood_tags         (list.single_line_text) JSON array string
//   custom.burn_time         (single_line_text)   e.g. "≈50 min / stick"
//   custom.flavor_tag_color  (single_line_text)   hex, drives the accent mechanic
// Keep these keys in sync with the metafield definitions in Shopify admin.

const PRODUCT_FRAGMENT = /* GraphQL */ `
  fragment ProductCore on Product {
    id
    handle
    title
    description
    priceRange {
      minVariantPrice { amount currencyCode }
    }
    featuredImage { url altText width height }
    images(first: 8) {
      nodes { url altText width height }
    }
    variants(first: 1) {
      nodes { id availableForSale }
    }
    notePairing: metafield(namespace: "custom", key: "note_pairing") { value }
    moodTags: metafield(namespace: "custom", key: "mood_tags") { value }
    burnTime: metafield(namespace: "custom", key: "burn_time") { value }
    flavorColor: metafield(namespace: "custom", key: "flavor_tag_color") { value }
  }
`;

/** Homepage featured scents + /shop grid. */
export const PRODUCTS_QUERY = /* GraphQL */ `
  query Products($first: Int = 10) {
    products(first: $first, sortKey: TITLE) {
      nodes { ...ProductCore }
    }
  }
  ${PRODUCT_FRAGMENT}
`;

/** PDP — /products/[handle]. */
export const PRODUCT_BY_HANDLE_QUERY = /* GraphQL */ `
  query ProductByHandle($handle: String!) {
    product(handle: $handle) {
      ...ProductCore
    }
  }
  ${PRODUCT_FRAGMENT}
`;

/* -------------------------------- Cart ---------------------------------- */

const CART_FRAGMENT = /* GraphQL */ `
  fragment CartCore on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      subtotalAmount { amount currencyCode }
      totalAmount { amount currencyCode }
    }
    lines(first: 50) {
      nodes {
        id
        quantity
        merchandise {
          ... on ProductVariant {
            id
            title
            price { amount currencyCode }
            image { url altText width height }
            product {
              handle
              title
              flavorColor: metafield(namespace: "custom", key: "flavor_tag_color") { value }
            }
          }
        }
      }
    }
  }
`;

export const CART_QUERY = /* GraphQL */ `
  query Cart($cartId: ID!) {
    cart(id: $cartId) { ...CartCore }
  }
  ${CART_FRAGMENT}
`;

export const CART_CREATE_MUTATION = /* GraphQL */ `
  mutation CartCreate($lines: [CartLineInput!]) {
    cartCreate(input: { lines: $lines }) {
      cart { ...CartCore }
      userErrors { field message }
    }
  }
  ${CART_FRAGMENT}
`;

export const CART_LINES_ADD_MUTATION = /* GraphQL */ `
  mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart { ...CartCore }
      userErrors { field message }
    }
  }
  ${CART_FRAGMENT}
`;

export const CART_LINES_UPDATE_MUTATION = /* GraphQL */ `
  mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart { ...CartCore }
      userErrors { field message }
    }
  }
  ${CART_FRAGMENT}
`;

export const CART_LINES_REMOVE_MUTATION = /* GraphQL */ `
  mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart { ...CartCore }
      userErrors { field message }
    }
  }
  ${CART_FRAGMENT}
`;
