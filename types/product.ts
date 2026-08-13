// Data model — docs §6.
// Used from Phase 1: the catalog models are real Product entries in
// data/products.ts, just without a configurator UI driving selectedOptions yet.

// Canonical currency is still undecided — see docs §7 open question 1.
export type Currency = 'USD' | 'ILS';

export interface VariantOption {
  id: string;
  category: string; // 'woodFinish' | 'driver' | 'size' | 'engraving' | ...
  label: string;
  priceDeltaCents: number; // integer — never float
  sku?: string;
}

export interface VariantCategory {
  category: string;
  label: string;
  required: boolean;
  options: VariantOption[];
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  basePriceCents: number;
  baseCurrency: Currency;
  images: string[];
  variantCategories: VariantCategory[];
}
