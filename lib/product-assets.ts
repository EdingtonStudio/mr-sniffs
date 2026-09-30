// Mr. Sniff's — studio photography and label colors shipped with the site.
//
// These win over whatever Shopify returns for the handle, so the storefront
// always matches the current packaging. First photo is the card / featured
// image. Remove a handle here to hand it back to Shopify.

import type { ShopifyImage } from './shopify';

const PHOTO = (url: string, altText: string): ShopifyImage => ({ url, altText, width: 1200, height: 1800 });

export const PRODUCT_PHOTOS: Record<string, ShopifyImage[]> = {
  'yoga-studio-palo-santo': [
    PHOTO('/photos/yoga-studio-1.jpg', 'Yoga Studio palo santo incense box on white'),
    PHOTO('/photos/yoga-studio-2.jpg', 'Yoga Studio incense box tucked into a mint linen suit jacket'),
    PHOTO('/photos/yoga-studio-3.jpg', 'Yoga Studio incense box with smoke on a dark concrete floor'),
  ],
  'bonfire-agarwood': [
    PHOTO('/photos/bonfire-1.jpg', 'Bonfire agarwood incense box on white'),
    PHOTO('/photos/bonfire-2.jpg', 'Tattooed hand holding a Bonfire incense box in blue smoke'),
  ],
  'duo-bundle': [
    PHOTO('/photos/duo-1.jpg', 'Yoga Studio and Bonfire incense boxes side by side'),
    PHOTO('/photos/duo-2.jpg', 'Rows of Yoga Studio and Bonfire incense boxes on black'),
  ],
};

/** Flavor accent per handle, sampled from the box labels. Mirrors styles/tokens.css. */
export const PRODUCT_COLORS: Record<string, string> = {
  'yoga-studio-palo-santo': '#A6D7DC',
  'bonfire-agarwood': '#EB3618',
};
