import Image from 'next/image';
import Link from 'next/link';
import styles from './Hero.module.css';

const META = [
  { label: 'Scents', value: '02' },
  { label: 'Ships', value: 'US' },
  { label: 'Burn Time', value: '~50 Min' },
];

export default function Hero() {
  return (
    <section className={styles.hero} aria-label="Mr. Sniff's — come get a whiff">
      {/* Centered display headline — overlaps the seam onto the photo, ESPN-style */}
      <h1 className={styles.headline}>
        <span className={styles.line}>Come Get</span>
        <span className={styles.line}>A Whiff</span>
      </h1>

      <div className={styles.panel}>
        <p className={styles.lede}>
          Handcrafted incense for people who actually have a nose. Real fragrance loads,
          names you&rsquo;ll remember, nothing you&rsquo;d hide in a drawer.
        </p>

        <div className={styles.foot}>
          <div className={styles.ctaRow}>
            <Link href="/shop" className={styles.orderBtn}>
              Order Now
            </Link>
            <Link href="/smell-test" className={styles.smellTest}>
              Take the Smell Test
            </Link>
          </div>

          <dl className={styles.meta}>
            {META.map((item) => (
              <div key={item.label} className={styles.metaCol}>
                <dt className={styles.metaLabel}>{item.label}</dt>
                <dd className={styles.metaValue}>{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className={styles.photo}>
        <Image
          src="/photos/hero-burn-notice.jpg"
          alt="Burn Notice incense, lit and smoking against a dark backdrop"
          fill
          priority
          sizes="(max-width: 820px) 100vw, 50vw"
          className={styles.photoImg}
        />
      </div>
    </section>
  );
}
