import Link from 'next/link';
import styles from './not-found.module.css';

export default function NotFound() {
  return (
    <section className={styles.page}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/brand/MrSniffs-Mascot-white.svg" alt="" aria-hidden="true" className={styles.mascot} />
      <h1 className={styles.headline}>
        This Page Doesn&rsquo;t Exist.
        <br />
        Neither Does Subtlety.
      </h1>
      <p className={styles.copy}>
        Whatever you were sniffing around for, it&rsquo;s not here. The scents are.
      </p>
      <Link href="/shop" className={styles.cta}>
        Back To The Shop
      </Link>
    </section>
  );
}
