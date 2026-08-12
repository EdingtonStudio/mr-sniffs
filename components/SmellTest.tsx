'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import FlavorTag from './FlavorTag';
import { shopifyFetch, mapProduct, type Product } from '@/lib/shopify';
import { PRODUCTS_QUERY } from '@/lib/queries';
import styles from './SmellTest.module.css';

type ScentHandle = 'bonfire-agarwood' | 'burn-notice-palo-santo';

interface Question {
  prompt: string;
  answers: [{ label: string; scent: ScentHandle }, { label: string; scent: ScentHandle }];
}

const QUESTIONS: Question[] = [
  {
    prompt: "It's 11PM. Pick your energy.",
    answers: [
      { label: 'Soft landing, do not disturb', scent: 'bonfire-agarwood' },
      { label: 'Main character, no notes', scent: 'burn-notice-palo-santo' },
    ],
  },
  {
    prompt: 'Your ideal room smells like',
    answers: [
      { label: 'Something that hugs back', scent: 'bonfire-agarwood' },
      { label: 'Something that dares you', scent: 'burn-notice-palo-santo' },
    ],
  },
  {
    prompt: 'Pick a crime.',
    answers: [
      { label: 'Ghosting the group chat to nap', scent: 'bonfire-agarwood' },
      { label: 'Starting drama on purpose', scent: 'burn-notice-palo-santo' },
    ],
  },
  {
    prompt: 'Last words before you light this incense.',
    answers: [
      { label: 'Finally. Peace.', scent: 'bonfire-agarwood' },
      { label: "Let's see what happens.", scent: 'burn-notice-palo-santo' },
    ],
  },
];

export default function SmellTest() {
  const [products, setProducts] = useState<Record<string, Product>>({});
  const [step, setStep] = useState(0);
  const [tally, setTally] = useState<Record<ScentHandle, number>>({ 'bonfire-agarwood': 0, 'burn-notice-palo-santo': 0 });
  const [lastPick, setLastPick] = useState<ScentHandle | null>(null);

  useEffect(() => {
    shopifyFetch<{ products: { nodes: unknown[] } }>({ query: PRODUCTS_QUERY, variables: { first: 20 } })
      .then((data) => {
        const byHandle: Record<string, Product> = {};
        data.products.nodes.map(mapProduct).forEach((p) => {
          byHandle[p.handle] = p;
        });
        setProducts(byHandle);
      })
      .catch(() => setProducts({}));
  }, []);

  const isDone = step >= QUESTIONS.length;
  const winner: ScentHandle =
    tally['burn-notice-palo-santo'] > tally['bonfire-agarwood']
      ? 'burn-notice-palo-santo'
      : tally['bonfire-agarwood'] > tally['burn-notice-palo-santo']
        ? 'bonfire-agarwood'
        : (lastPick ?? 'bonfire-agarwood');
  const matched = products[winner];

  function pick(scent: ScentHandle) {
    setTally((prev) => ({ ...prev, [scent]: prev[scent] + 1 }));
    setLastPick(scent);
    setStep((s) => s + 1);
  }

  function restart() {
    setStep(0);
    setTally({ 'bonfire-agarwood': 0, 'burn-notice-palo-santo': 0 });
    setLastPick(null);
  }

  if (isDone) {
    return (
      <div className={styles.result}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/seal-ember.png" alt="" aria-hidden="true" className={styles.stamp} />
        <p className={styles.resultKicker}>Your Whiff Match Is</p>
        <FlavorTag
          label={matched?.title ?? '…'}
          color={matched?.scent.flavorColor ?? undefined}
          size="lg"
          className={styles.resultTag}
        />
        {matched?.scent.notePairing ? <p className={styles.resultNotes}>{matched.scent.notePairing}</p> : null}
        <div className={styles.resultActions}>
          {matched ? (
            <Link href={`/products/${matched.handle}`} className={styles.resultCta}>
              Meet {matched.title}
            </Link>
          ) : null}
          <button type="button" className={styles.restart} onClick={restart}>
            Take It Again
          </button>
        </div>
      </div>
    );
  }

  const question = QUESTIONS[step];

  return (
    <div className={styles.quiz}>
      <p className={styles.progress}>
        Q{step + 1} / {QUESTIONS.length}
      </p>
      <h2 className={styles.prompt}>{question.prompt}</h2>
      <div className={styles.answers}>
        {question.answers.map((answer) => (
          <button
            key={answer.label}
            type="button"
            className={styles.answerBtn}
            onClick={() => pick(answer.scent)}
          >
            <FlavorTag
              label={answer.label}
              rotate={false}
              size="lg"
              variant="outline"
              className={styles.answerTag}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
