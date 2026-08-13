import type { Metadata } from 'next';
import EditorialSection from '@/components/EditorialSection';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: "FAQ — Mr. Sniff's",
  description: "Everything you need to know before you light one up.",
};

const FAQS = [
  {
    q: 'What are these actually made of?',
    a: 'Real fragrance loads on a hand-rolled stick — no shortcuts, no synthetic filler dressed up as "essential." Each scent is built from a note pairing, not a mystery blend.',
  },
  {
    q: 'How long does one stick burn?',
    a: 'About 50 minutes per stick, give or take your room’s airflow. Long enough to matter, short enough that you won’t forget it’s lit.',
  },
  {
    q: 'I can only pick one. Which scent do I get?',
    a: 'Take the Smell Test — four questions, no accounts, no email gate. Or just get both with the Duo Bundle and stop torturing yourself.',
  },
  {
    q: 'Is it safe to burn indoors?',
    a: 'Yes, with the same common sense you’d use for any open flame: burn on a heatproof holder, keep it away from anything flammable, don’t leave it unattended, and keep it clear of kids and pets.',
  },
  {
    q: 'Where do you ship?',
    a: 'Currently the U.S. Rates and delivery windows are calculated at checkout before you pay for anything.',
  },
  {
    q: 'Can I return it if it’s not for me?',
    a: 'See our Shipping & Returns policy in the footer for the full breakdown — we’re not going to bury it in fine print here.',
  },
];

export default function FaqPage() {
  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <p className={styles.kicker}>Before you burn one</p>
        <h1 className={styles.title}>Questions, Answered.</h1>
      </header>
      <div className={styles.list}>
        {FAQS.map((item, i) => (
          <EditorialSection
            key={item.q}
            num={`${String(i + 1).padStart(2, '0')}/`}
            label={item.q}
            defaultOpen={i === 0}
          >
            <p className={styles.a}>{item.a}</p>
          </EditorialSection>
        ))}
      </div>
    </section>
  );
}
