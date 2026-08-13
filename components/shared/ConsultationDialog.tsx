'use client';

import { useEffect, useRef, useState, type FormEvent, type MouseEvent } from 'react';

import type { Dictionary, Locale } from '@/i18n';
import { getFormspreeEndpoint } from '@/lib/formspree';
import styles from './ConsultationDialog.module.css';

type Variant = 'primary' | 'secondary';

type ProductContext = {
  name: string;
  slug: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  variant: Variant;
  t: Dictionary;
  locale: Locale;
  product?: ProductContext;
};

type Status = 'idle' | 'pending' | 'success' | 'error';

/**
 * Shared consultation-inquiry dialog (issue #13). Opened by the CTA buttons
 * in both components/homepage/Consultation.tsx and
 * components/catalog/ProductConsultationCta.tsx — a single implementation so
 * homepage and product-page submissions go through identical logic.
 *
 * Built on the native <dialog> element rather than a hand-rolled overlay: it
 * gives focus-trap, Esc-to-close, and focus-return-to-trigger behavior for
 * free, which a from-scratch modal would otherwise have to reimplement to
 * meet the spec's accessibility bar (issue #13 AC 7).
 *
 * Deliberately a modal rather than inline fields in
 * components/homepage/Consultation.tsx's resting layout: the design handoff
 * (design_handoff_eliyah_homepage/README.md line 66) specs that section as
 * two styled text CTAs with no visible form fields, and this keeps that
 * pixel-faithful resting state untouched while still making the CTAs submit
 * for real.
 */
export function ConsultationDialog({ open, onClose, variant, t, locale, product }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [status, setStatus] = useState<Status>('idle');
  const formCopy = t.consultationForm;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  function handleDialogClose() {
    // Fires on Esc and on the native backdrop-cancel path too, so this is
    // the single source of truth for "the dialog just closed" — not just
    // clicks on the explicit close button.
    onClose();
  }

  function handleDialogClick(event: MouseEvent<HTMLDialogElement>) {
    // Native <dialog> doesn't close on backdrop click by default. A click
    // that lands on the <dialog> element itself (not a descendant) means it
    // hit the ::backdrop, not the panel — the panel is a full-size child
    // (.panel) that would otherwise absorb the click first (Reviewer,
    // issue #13 fix cycle 1).
    if (event.target === dialogRef.current) onClose();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const endpoint = getFormspreeEndpoint();

    if (!endpoint) {
      // See lib/formspree.ts — no real form id has been configured yet.
      console.warn(
        '[ConsultationDialog] NEXT_PUBLIC_FORMSPREE_FORM_ID is unset — see lib/formspree.ts and .env.example.',
      );
      setStatus('error');
      return;
    }

    setStatus('pending');
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });
      if (response.ok) {
        setStatus('success');
        form.reset();
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  const subject = variant === 'primary' ? formCopy.subjectPrimary : formCopy.subjectSecondary;
  const defaultMessage = product
    ? formCopy.productMessageTemplate.replace('{product}', product.name)
    : '';

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-labelledby="consultation-dialog-heading"
      onClose={handleDialogClose}
      onCancel={handleDialogClose}
      onClick={handleDialogClick}
    >
      <div className={styles.panel} dir={locale === 'he' ? 'rtl' : 'ltr'}>
        <button
          type="button"
          className={styles.closeButton}
          onClick={onClose}
          aria-label={formCopy.close}
        >
          &times;
        </button>

        {status === 'success' ? (
          <div className={styles.result} role="status">
            <h2 id="consultation-dialog-heading" className={styles.heading}>
              {formCopy.successHead}
            </h2>
            <p className={styles.resultBody}>{formCopy.successBody}</p>
          </div>
        ) : (
          <form className={styles.form} onSubmit={handleSubmit}>
            <h2 id="consultation-dialog-heading" className={styles.heading}>
              {variant === 'primary' ? t.cta.primary : t.cta.secondary}
            </h2>
            <p className={styles.intro}>{formCopy.intro}</p>

            <input type="hidden" name="_subject" value={subject} />
            <input type="hidden" name="locale" value={locale} />
            <input type="hidden" name="product" value={product ? `${product.name} (${product.slug})` : ''} />
            {/* Formspree honeypot convention: real users never see or fill
                this field; bots that fill every input trip it and Formspree
                silently discards the submission. */}
            <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" className={styles.honeypot} />

            <div className={styles.field}>
              <label htmlFor="consultation-name" className={styles.label}>
                {formCopy.nameLabel}
              </label>
              <input
                id="consultation-name"
                name="name"
                type="text"
                required
                autoComplete="name"
                className={styles.input}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="consultation-email" className={styles.label}>
                {formCopy.emailLabel}
              </label>
              <input
                id="consultation-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className={styles.input}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="consultation-message" className={styles.label}>
                {formCopy.messageLabel}
              </label>
              <textarea
                id="consultation-message"
                name="message"
                required
                rows={4}
                defaultValue={defaultMessage}
                className={styles.textarea}
              />
            </div>

            {status === 'error' && (
              <p className={styles.errorText} role="alert">
                {formCopy.errorBody}
              </p>
            )}

            <button type="submit" className={styles.submit} disabled={status === 'pending'}>
              {status === 'pending' ? formCopy.pending : formCopy.submit}
            </button>
          </form>
        )}
      </div>
    </dialog>
  );
}
