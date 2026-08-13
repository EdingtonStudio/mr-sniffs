import type { Metadata } from 'next';
import Link from 'next/link';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: "About — Mr. Sniff's",
  description: 'Bold, handcrafted incense for people who actually have a nose.',
};

/* Placeholder frame where real brand photography will eventually go —
   deliberately unbranded so nothing here reads as final art. */
function PhotoPlaceholder({ label, ratio }: { label: string; ratio?: 'wide' | 'tall' | 'square' }) {
  return (
    <figure className={[styles.ph, ratio === 'wide' ? styles.phWide : ratio === 'tall' ? styles.phTall : styles.phSquare].join(' ')}>
      <span className={styles.phCross} aria-hidden="true" />
      <figcaption className={styles.phLabel}>{label}</figcaption>
    </figure>
  );
}

const PILLARS = [
  {
    title: 'Bold, Not Precious',
    body: "Great fragrance should be bold, irreverent, and worth talking about — not something you hide in a drawer or save for a spa day.",
  },
  {
    title: 'Handcrafted, For Real',
    body: 'Real fragrance loads on a hand-rolled stick. No shortcuts, no synthetic filler dressed up as "essential."',
  },
  {
    title: 'Just Wood, No Nonsense',
    body: "We burn wood — palo santo, agarwood — and that's it. No extra nonsense, nothing in the stick that doesn't belong there.",
  },
];

const PROCESS = [
  { num: '01', title: 'Built From A Note Pairing', body: 'Each scent starts as a deliberate pairing of notes — not a mystery blend.' },
  { num: '02', title: 'Hand-Rolled Sticks', body: 'Rolled by hand with a real fragrance load, so the room actually notices.' },
  { num: '03', title: '~50 Minutes A Burn', body: 'Long enough to matter, short enough that you won’t forget it’s lit.' },
];

export default function AboutPage() {
  return (
    <article className={styles.page}>
      {/* --- Split header, echoing the homepage hero composition --- */}
      <header className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.kicker}>About Mr. Sniff&rsquo;s</p>
          <h1 className={styles.headline}>
            We Make Incense For People Who Have A Nose.
          </h1>
          <p className={styles.intro}>
            Not the kind you light for a spa day — the kind that fills a room, starts a
            conversation, and makes your weird neighbor ask what you&rsquo;re burning.
          </p>
        </div>
        <PhotoPlaceholder label="Photo — Founder / Studio Portrait" ratio="tall" />
      </header>

      {/* --- 01 / What we're about — three-column breakdown --- */}
      <section className={styles.section}>
        <header className={styles.sectionHead}>
          <span className={styles.sectionNum}>01/</span>
          <h2 className={styles.sectionTitle}>What We&rsquo;re About</h2>
        </header>
        <div className={styles.pillars}>
          {PILLARS.map((pillar) => (
            <div key={pillar.title} className={styles.pillar}>
              <h3 className={styles.pillarTitle}>{pillar.title}</h3>
              <p className={styles.pillarBody}>{pillar.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- 02 / Mission & vision --- */}
      <section className={styles.section}>
        <header className={styles.sectionHead}>
          <span className={styles.sectionNum}>02/</span>
          <h2 className={styles.sectionTitle}>Why We&rsquo;re Here</h2>
        </header>
        <div className={styles.mission}>
          <div className={styles.missionBlock}>
            <p className={styles.blockLabel}>Mission</p>
            <p className={styles.blockBody}>
              We&rsquo;re here to prove that incense doesn&rsquo;t have to be precious. Great
              fragrance should be bold, irreverent, and worth talking about — not something
              you hide in a drawer.
            </p>
          </div>
          <div className={styles.missionBlock}>
            <p className={styles.blockLabel}>Vision</p>
            <p className={styles.blockBody}>
              We&rsquo;re building toward something simple: a world where Mr. Sniff&rsquo;s is
              the first name people reach for when they want a scent with an actual point of
              view.
            </p>
          </div>
          <PhotoPlaceholder label="Photo — Product In Situ" ratio="square" />
        </div>
      </section>

      {/* --- 03 / How it's made --- */}
      <section className={styles.section}>
        <header className={styles.sectionHead}>
          <span className={styles.sectionNum}>03/</span>
          <h2 className={styles.sectionTitle}>How It&rsquo;s Made</h2>
        </header>
        <div className={styles.process}>
          <PhotoPlaceholder label="Photo — Hands Rolling Incense" ratio="wide" />
          <ol className={styles.steps}>
            {PROCESS.map((step) => (
              <li key={step.num} className={styles.step}>
                <span className={styles.stepNum}>{step.num}</span>
                <div>
                  <h3 className={styles.stepTitle}>{step.title}</h3>
                  <p className={styles.stepBody}>{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* --- 04 / Closer + CTA --- */}
      <section className={styles.section}>
        <header className={styles.sectionHead}>
          <span className={styles.sectionNum}>04/</span>
          <h2 className={styles.sectionTitle}>Smell For Yourself</h2>
        </header>
        <div className={styles.closer}>
          <p className={styles.closerCopy}>
            Handcrafted incense, real fragrance loads, names you&rsquo;ll actually remember.
            Life&rsquo;s too short to burn something forgettable.
          </p>
          <div className={styles.closerActions}>
            <Link href="/shop" className={styles.closerBtn}>
              Shop The Lineup
            </Link>
            <Link href="/smell-test" className={styles.closerLink}>
              Take The Smell Test
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}
