import type { Currency } from '@/types/product';
import type { Locale } from '@/i18n';

// Renders a `Product.basePriceCents`/`baseCurrency` pair as an indicative,
// locale-formatted price string (docs §2.1: catalog cards show an
// "indicative price", never a buy-button price). `Intl.NumberFormat`'s
// currency formatter expects whole units, not integer cents (docs §6's
// integer-cents convention exists to avoid float math, not to change the
// display unit) — divide back down before formatting.
export function formatIndicativePrice(
  cents: number,
  currency: Currency,
  locale: Locale,
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}
