import Link from 'next/link';
import NewsletterForm from './NewsletterForm';
import styles from './Footer.module.css';

// Shipping/Returns and Privacy/Terms are Shopify-hosted (auto-generated), not part of the Next.js build.
const storeDomain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const policyBase = storeDomain ? `https://${storeDomain}` : '';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      {/* Full-bleed ghost wordmark — backdrop behind all footer content, darkened for legibility */}
      <div className={styles.wordmarkWrap} aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/MrSniffs-Logo-white.svg" alt="" className={styles.wordmark} />
      </div>

      <div className={styles.content}>
        <div className={styles.inner}>
          <div className={styles.top}>
            <div className={styles.brand}>
              <p className={styles.tagline}>Handcrafted incense for people who actually have a nose.</p>
            </div>

            <div className={styles.navGroups}>
              <nav className={styles.navGroup} aria-label="Shop">
                <p className={styles.navGroupLabel}>Shop</p>
                <Link href="/shop">Shop</Link>
                <Link href="/smell-test">Smell Test</Link>
                <Link href="/about">About</Link>
              </nav>
              <nav className={styles.navGroup} aria-label="Support">
                <p className={styles.navGroupLabel}>Support</p>
                <Link href="/faq">FAQ</Link>
                <Link href="/contact">Contact</Link>
                {policyBase ? (
                  <>
                    <a href={`${policyBase}/policies/shipping-policy`}>Shipping &amp; Returns</a>
                    <a href={`${policyBase}/policies/privacy-policy`}>Privacy &amp; Terms</a>
                  </>
                ) : null}
              </nav>
            </div>

            <div className={styles.newsletter}>
              <NewsletterForm />
            </div>
          </div>
        </div>

        <div className={styles.inner}>
          <div className={styles.bottom}>
            <a
              href="https://instagram.com/mrsniffs"
              target="_blank"
              rel="noreferrer noopener"
              aria-label="Mr. Sniff's on Instagram"
              className={styles.social}
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4.2" />
                <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
              </svg>
            </a>
            <p className={styles.copyright}>© {new Date().getFullYear()} Mr. Sniff&rsquo;s. We just make scents.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
