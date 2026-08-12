'use client';

// Editorial numbered-row section — the site-wide expand/collapse pattern.
// A slim one-line row (number / label / toggle glyph) over a hairline, revealing
// its content inline. Rows read as an index when collapsed, a page when open.

import { useId, useState, type ReactNode } from 'react';
import styles from './EditorialSection.module.css';

interface EditorialSectionProps {
  num: string; // "01/"
  label: string;
  /** Small mono annotation on the right, before the toggle (e.g. a count). */
  note?: string;
  defaultOpen?: boolean;
  children: ReactNode;
}

export default function EditorialSection({
  num,
  label,
  note,
  defaultOpen = false,
  children,
}: EditorialSectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();

  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>
        <button
          type="button"
          className={styles.row}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((v) => !v)}
        >
          <span className={styles.num}>{num}</span>
          <span className={styles.label}>{label}</span>
          {note ? <span className={styles.note}>{note}</span> : null}
          <span className={[styles.toggle, open ? styles.toggleOpen : ''].join(' ')} aria-hidden="true">
            <span className={styles.toggleBarH} />
            <span className={styles.toggleBarV} />
          </span>
        </button>
      </h2>
      {/* Collapsed panels are visibility:hidden (out of tab order + AT); grid-rows animates the reveal. */}
      <div id={panelId} className={[styles.panel, open ? styles.panelOpen : ''].join(' ')}>
        <div className={styles.panelClip}>
          <div className={styles.panelInner}>{children}</div>
        </div>
      </div>
    </section>
  );
}
