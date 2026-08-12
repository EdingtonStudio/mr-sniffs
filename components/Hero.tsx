import Image from 'next/image';
import Link from 'next/link';
import styles from './Hero.module.css';

// ESPN-style numbered index items — number + two-line editorial caption.
const INDEX_ITEMS = [
  {
    num: '011',
    title: 'The Scent Lineup',
    caption: 'Two scents. Real fragrance loads, zero filler.',
    href: '/shop',
  },
  {
    num: '021',
    title: 'The Smell Test',
    caption: 'Four questions. One winner for your nose.',
    href: '/smell-test',
  },
];

const META = [
  { label: 'Scents', value: '02' },
  { label: 'Ships', value: 'US' },
  { label: 'Burn Time', value: '~50 Min' },
];

const SCENT_INDEX = ['Burn Notice · Palo Santo', 'Bon Fire · Agarwood', 'The Duo Bundle'];

export default function Hero() {
  return (
    <section className={styles.hero} aria-label="Mr. Sniff's — get a whiff">
      {/* Centered display headline — overlaps the seam onto the photo, ESPN-style */}
      <h1 className={styles.headline}>
        <span className={styles.line}>Get</span>
        <span className={styles.line}>
          A <span className={styles.underlined}>Whiff</span>
        </span>
      </h1>

      <div className={styles.panel}>
        <ol className={styles.indexNav}>
          {INDEX_ITEMS.map((item) => (
            <li key={item.num} className={styles.indexItem}>
              <Link href={item.href} className={styles.indexLink}>
                <span className={styles.indexNum}>{item.num}</span>
                <span className={styles.indexText}>
                  <span className={styles.indexTitle}>{item.title}</span>
                  <span className={styles.indexCaption}>{item.caption}</span>
                </span>
              </Link>
            </li>
          ))}
        </ol>

        <div className={styles.foot}>
          <p className={styles.lede}>
            Handcrafted incense for people who actually have a nose. Real fragrance loads,
            names you&rsquo;ll remember, nothing you&rsquo;d hide in a drawer.
          </p>

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
        <div className={styles.photoFooter}>
          <ul className={styles.scentIndex}>
            {SCENT_INDEX.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
          <span className={styles.numeral} aria-hidden="true">
            02
          </span>
        </div>
      </div>
    </section>
  );
}
