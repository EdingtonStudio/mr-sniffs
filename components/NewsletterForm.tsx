'use client';

import { useState, type FormEvent } from 'react';
import styles from './NewsletterForm.module.css';

// TODO: wire to a real ESP (Klaviyo/Mailchimp) — currently just a client-side confirmation.
export default function NewsletterForm({ className }: { className?: string }) {
  const [status, setStatus] = useState<'idle' | 'sent'>('idle');

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('sent');
  }

  if (status === 'sent') {
    return (
      <p className={[styles.confirm, className].filter(Boolean).join(' ')}>
        You&rsquo;re in. Try not to burn the place down.
      </p>
    );
  }

  return (
    <form className={[styles.form, className].filter(Boolean).join(' ')} onSubmit={handleSubmit}>
      <label htmlFor="newsletter-email" className={styles.label}>
        Get first whiff of new scents
      </label>
      <div className={styles.row}>
        <input
          id="newsletter-email"
          name="email"
          type="email"
          required
          placeholder="your@email.com"
          className={styles.input}
        />
        <button type="submit" className={styles.submit}>
          Sign Up
        </button>
      </div>
    </form>
  );
}
