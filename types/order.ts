// Data model — docs §6.
// Declared now so Phase 1's Product shape doesn't box in the eventual
// configurator (Phase 2) / checkout (Phase 3). Nothing in Phase 1 constructs
// these; this file is type declarations only, with no runtime code.

import type { Currency } from './product';

export interface ProductConfiguration {
  productId: string;
  selectedOptions: Record<string, string>; // category -> optionId
  engravingText?: string; // cap length in the UI, not the type
}

export interface PriceResult {
  currency: Currency;
  amountCents: number;
  vatIncluded: boolean;
  breakdown: { label: string; amountCents: number }[];
}

// Phase 3+
export interface Order {
  id: string;
  createdAt: string;
  config: ProductConfiguration;
  customer: { email: string; name: string; billingCountry: string };
  paymentProvider: 'stripe' | 'tranzila';
  paymentReference: string;
  price: PriceResult; // computed server-side from config — never trusted from client
  status: 'pending' | 'paid' | 'failed' | 'fulfilled';
}
