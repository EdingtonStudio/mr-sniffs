import type { Metadata } from 'next';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: "Contact · Mr. Sniff's",
  description: 'Get in touch with Mr. Sniff\'s.',
};

export default function ContactPage() {
  return (
    <section className={styles.page}>
      <p className={styles.kicker}>Say something</p>
      <h1 className={styles.title}>Get In Touch.</h1>
      <p className={styles.copy}>
        Question about an order, a scent, or just want to tell us your neighbor complained about the smoke?
        We read everything.
      </p>
      <a href="mailto:hello@mrsniffs.com" className={styles.cta}>
        hello@mrsniffs.com
      </a>
      <p className={styles.note}>We usually get back to you within 1&ndash;2 business days.</p>
    </section>
  );
}
