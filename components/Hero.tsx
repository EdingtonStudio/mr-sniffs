import Image from 'next/image';
import Link from 'next/link';
import ParallaxNumeral from './ParallaxNumeral';
import styles from './Hero.module.css';

const META = [
  { label: 'Scents', value: '02' },
  { label: 'Ships', value: 'US' },
  { label: 'Burn Time', value: '~50 Min' },
];

export default function Hero() {
  return (
    <section className={styles.hero} aria-label="Mr. Sniff's — come get a whiff">
      <ParallaxNumeral value="02" className={styles.bigNumeral} />

      <div className={styles.inner}>
        <div className={styles.photo} data-parallax-target>
          <Image
            src="/photos/hero-burn-notice.jpg"
            alt="Burn Notice incense, lit and smoking against a dark backdrop"
            fill
            priority
            sizes="(max-width: 820px) 100vw, 42vw"
            className={styles.photoImg}
          />
        </div>

        <div className={styles.content}>
          <dl className={styles.meta}>
            {META.map((item) => (
              <div key={item.label} className={styles.metaCol}>
                <dt className={styles.metaLabel}>{item.label}</dt>
                <dd className={styles.metaValue}>{item.value}</dd>
              </div>
            ))}
          </dl>

          <h1 className={styles.headline}>
            <span className={styles.line}>Come Get</span>
            <span className={`${styles.line} ${styles.accentLine}`}>A Whiff</span>
          </h1>

          <div className={styles.ctaRow}>
            <Link href="/shop" className={styles.orderBtn}>
              Order Now
            </Link>
            <Link href="/smell-test" className={styles.smellTest}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/brand/MrSniffs-Mascot-white.svg"
                alt=""
                aria-hidden="true"
                className={styles.mascot}
              />
              <span className={styles.smellTestLabel}>Take the Smell Test</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
