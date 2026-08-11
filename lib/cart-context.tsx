'use client';

// Mr. Sniff's — client-side Shopify cart state.
// Cart id persists in localStorage; cart contents always come fresh from the
// Storefront API (never trust local state as the source of truth for price/stock).

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { shopifyFetch, mapProduct, type Product } from './shopify';
import {
  CART_QUERY,
  CART_CREATE_MUTATION,
  CART_LINES_ADD_MUTATION,
  CART_LINES_REMOVE_MUTATION,
  PRODUCT_BY_HANDLE_QUERY,
} from './queries';

const CART_ID_KEY = 'mr-sniffs-cart-id';

export interface CartLine {
  id: string;
  quantity: number;
  merchandiseId: string;
  title: string;
  handle: string | null;
  price: { amount: string; currencyCode: string };
  image: { url: string; altText: string | null } | null;
  flavorColor: string | null;
}

export interface CartState {
  id: string | null;
  checkoutUrl: string | null;
  lines: CartLine[];
  totalQuantity: number;
  subtotal: { amount: string; currencyCode: string } | null;
}

const emptyCart: CartState = {
  id: null,
  checkoutUrl: null,
  lines: [],
  totalQuantity: 0,
  subtotal: null,
};

/* eslint-disable @typescript-eslint/no-explicit-any */
function normalizeCart(raw: any): CartState {
  if (!raw) return emptyCart;
  return {
    id: raw.id,
    checkoutUrl: raw.checkoutUrl,
    totalQuantity: raw.totalQuantity ?? 0,
    subtotal: raw.cost?.subtotalAmount ?? null,
    lines: (raw.lines?.nodes ?? []).map((n: any) => ({
      id: n.id,
      quantity: n.quantity,
      merchandiseId: n.merchandise?.id,
      title: n.merchandise?.product?.title ?? n.merchandise?.title ?? '',
      handle: n.merchandise?.product?.handle ?? null,
      price: n.merchandise?.price ?? { amount: '0', currencyCode: 'USD' },
      image: n.merchandise?.image ?? null,
      flavorColor: n.merchandise?.product?.flavorColor?.value ?? null,
    })),
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

interface CartContextValue {
  cart: CartState;
  isOpen: boolean;
  isLoading: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (variantId: string, quantity?: number) => Promise<void>;
  removeLine: (lineId: string) => Promise<void>;
  /** The Duo Bundle product, fetched once for the cart upsell slot. Null while loading or if unavailable. */
  duoBundle: Product | null;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartState>(emptyCart);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [duoBundle, setDuoBundle] = useState<Product | null>(null);

  useEffect(() => {
    const id = window.localStorage.getItem(CART_ID_KEY);
    if (!id) return;
    shopifyFetch<{ cart: unknown }>({ query: CART_QUERY, variables: { cartId: id }, cache: 'no-store' })
      .then((data) => {
        if (data.cart) {
          setCart(normalizeCart(data.cart));
        } else {
          window.localStorage.removeItem(CART_ID_KEY);
        }
      })
      .catch(() => window.localStorage.removeItem(CART_ID_KEY));
  }, []);

  useEffect(() => {
    shopifyFetch<{ product: unknown }>({
      query: PRODUCT_BY_HANDLE_QUERY,
      variables: { handle: 'duo-bundle' },
      revalidate: 300,
    })
      .then((data) => setDuoBundle(data.product ? mapProduct(data.product) : null))
      .catch(() => setDuoBundle(null));
  }, []);

  const addToCart = useCallback(
    async (variantId: string, quantity = 1) => {
      setIsLoading(true);
      try {
        if (!cart.id) {
          const data = await shopifyFetch<{
            cartCreate: { cart: unknown; userErrors: Array<{ message: string }> };
          }>({
            query: CART_CREATE_MUTATION,
            variables: { lines: [{ merchandiseId: variantId, quantity }] },
            cache: 'no-store',
          });
          if (data.cartCreate.userErrors?.length) {
            throw new Error(data.cartCreate.userErrors.map((e) => e.message).join('; '));
          }
          const created = data.cartCreate.cart;
          window.localStorage.setItem(CART_ID_KEY, (created as { id: string }).id);
          setCart(normalizeCart(created));
        } else {
          const data = await shopifyFetch<{
            cartLinesAdd: { cart: unknown; userErrors: Array<{ message: string }> };
          }>({
            query: CART_LINES_ADD_MUTATION,
            variables: { cartId: cart.id, lines: [{ merchandiseId: variantId, quantity }] },
            cache: 'no-store',
          });
          if (data.cartLinesAdd.userErrors?.length) {
            throw new Error(data.cartLinesAdd.userErrors.map((e) => e.message).join('; '));
          }
          setCart(normalizeCart(data.cartLinesAdd.cart));
        }
        setIsOpen(true);
      } finally {
        setIsLoading(false);
      }
    },
    [cart.id]
  );

  const removeLine = useCallback(
    async (lineId: string) => {
      if (!cart.id) return;
      setIsLoading(true);
      try {
        const data = await shopifyFetch<{ cartLinesRemove: { cart: unknown } }>({
          query: CART_LINES_REMOVE_MUTATION,
          variables: { cartId: cart.id, lineIds: [lineId] },
          cache: 'no-store',
        });
        setCart(normalizeCart(data.cartLinesRemove.cart));
      } finally {
        setIsLoading(false);
      }
    },
    [cart.id]
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        isOpen,
        isLoading,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
        addToCart,
        removeLine,
        duoBundle,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
}
