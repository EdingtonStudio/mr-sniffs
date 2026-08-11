import type { Metadata } from 'next';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: "About — Mr. Sniff's",
  description: 'Bold, handcrafted incense for people who actually have a nose.',
};

export default function AboutPage() {
  return (
    <section className={styles.page}>
      <header className={styles.hero}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/MrSniffs-Mascot-white.svg" alt="Mr. Sniff, the brand mascot" className={styles.mascot} />
        <h1 className={styles.headline}>
          We Make Incense For People
          <br />
          Who Actually Have A Nose.
        </h1>
        <p className={styles.intro}>
          Not the kind you light for a spa day — the kind that fills a room, starts a conversation, and makes
          your weird neighbor ask what you&rsquo;re burning.
        </p>
      </header>

      <div className={styles.blocks}>
        <div className={styles.block}>
          <p className={styles.blockLabel}>Mission</p>
          <p className={styles.blockBody}>
            We&rsquo;re here to prove that incense doesn&rsquo;t have to be precious. Great fragrance should be
            bold, irreverent, and worth talking about — not something you hide in a drawer.
          </p>
        </div>
        <div className={styles.block}>
          <p className={styles.blockLabel}>Vision</p>
          <p className={styles.blockBody}>
            We&rsquo;re building toward something simple: a world where Mr. Sniff&rsquo;s is the first name people
            reach for when they want a scent with an actual point of view.
          </p>
        </div>
      </div>

      <p className={styles.closer}>
        Handcrafted incense, real fragrance loads, names you&rsquo;ll actually remember. Life&rsquo;s too short to
        burn something forgettable.
      </p>
    </section>
  );
}
