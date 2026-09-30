// Mr. Sniff's — studio photography shipped with the site.
//
// These win over whatever images Shopify returns for the handle, so the
// storefront always shows the current shoot. First entry is the card /
// featured image. Remove a handle here to hand its imagery back to Shopify.

import type { ShopifyImage } from './shopify';

const PHOTO = (url: string, altText: string): ShopifyImage => ({ url, altText, width: 1200, height: 1800 });

export const PRODUCT_PHOTOS: Record<string, ShopifyImage[]> = {
  'yoga-studio-palo-santo': [
    PHOTO('/photos/yoga-studio-1.jpg', 'Yoga Studio palo santo incense box on white'),
    PHOTO('/photos/yoga-studio-2.jpg', 'Yoga Studio incense box tucked into a mint linen suit jacket'),
    PHOTO('/photos/yoga-studio-3.jpg', 'Yoga Studio incense box with smoke on a dark concrete floor'),
  ],
  'bonfire-agarwood': [
    PHOTO('/photos/bon-fire-1.jpg', 'Bon Fire agarwood incense box on white'),
    PHOTO('/photos/bon-fire-2.jpg', 'Tattooed hand holding a Bon Fire incense box in blue smoke'),
  ],
  'duo-bundle': [
    PHOTO('/photos/duo-1.jpg', 'Yoga Studio and Bon Fire incense boxes side by side'),
    PHOTO('/photos/duo-2.jpg', 'Rows of Yoga Studio and Bon Fire incense boxes on black'),
  ],
};
