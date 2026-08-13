'use client';

import Image from 'next/image';
import { useState } from 'react';

import type { Dictionary } from '@/i18n';
import styles from './ProductGallery.module.css';

type Props = {
  images: string[];
  t: Dictionary;
};

/**
 * Product detail page gallery (docs §3.4 `catalog/`, issue #11): a single
 * main image with a clickable thumbnail row when a product has more than one
 * image. Swapping the main image is an instant state change, not an
 * animated crossfade — mirrors the plain-static precedent set by the
 * catalog listing page (issue #10) rather than introducing a new
 * reduced-motion case to gate.
 *
 * RTL handling: the thumbnail row's visual order flips via `direction:
 * var(--text-dir)` (styles/tokens.css) — the same mechanism every other
 * component uses (docs §3.2/§5.3). This component never branches on locale
 * itself; `t` is only used for the thumbnail buttons' accessible names.
 */
export function ProductGallery({ images, t }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = images[activeIndex] ?? images[0];

  return (
    <div className={styles.gallery}>
      <div className={styles.mainWrap}>
        <Image
          src={active}
          alt=""
          fill
          sizes="(max-width: 900px) 100vw, 50vw"
          unoptimized
          priority
          className={styles.mainImage}
        />
      </div>
      {images.length > 1 && (
        <div className={styles.thumbRow}>
          {images.map((src, index) => (
            <button
              key={src}
              type="button"
              className={index === activeIndex ? `${styles.thumb} ${styles.thumbActive}` : styles.thumb}
              onClick={() => setActiveIndex(index)}
              aria-label={`${t.products.viewImage} ${index + 1}`}
              aria-pressed={index === activeIndex}
            >
              <Image src={src} alt="" fill sizes="120px" unoptimized className={styles.thumbImage} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
