import type { Metadata } from 'next';
import SmellTest from '@/components/SmellTest';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: "Smell Test — Mr. Sniff's",
  description: 'Four questions. One winner for your nose. Take the Mr. Sniff\'s Smell Test.',
};

export default function SmellTestPage() {
  return (
    <section className={styles.page}>
      <SmellTest />
    </section>
  );
}
