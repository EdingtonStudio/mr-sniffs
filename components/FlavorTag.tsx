import type { CSSProperties } from 'react';
import styles from './FlavorTag.module.css';

type Size = 'sm' | 'md' | 'lg';
type Variant = 'solid' | 'outline';

interface FlavorTagProps {
  label: string;
  /** Flavor accent hex, e.g. "#E06666". Falls back to Iron (solid) or White (outline). */
  color?: string;
  size?: Size;
  rotate?: boolean;
  /** 'solid' — sticker/packaging label (default). 'outline' — ghost/editorial mark, no fill. */
  variant?: Variant;
  className?: string;
}

export default function FlavorTag({
  label,
  color,
  size = 'md',
  rotate = true,
  variant = 'solid',
  className,
}: FlavorTagProps) {
  return (
    <span
      className={[
        styles.tag,
        styles[variant],
        styles[size],
        rotate ? styles.rotate : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={color ? ({ '--tag-color': color } as CSSProperties) : undefined}
    >
      {label}
    </span>
  );
}
