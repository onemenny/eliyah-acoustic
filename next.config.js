/** @type {import('next').NextConfig} */

// Phase 1 ships as a static export on GitHub Pages (docs §3.1). Project-page
// deployments live under /<repo>, so basePath/assetPrefix are gated on a single
// env var that the deploy workflow sets and local dev leaves empty. Dropping
// `output: 'export'` and unsetting the var is the whole Phase 2 Vercel move.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

const nextConfig = {
  output: 'export',
  // Next 16 otherwise appends a generated block to the repo's CLAUDE.md on
  // every `next dev`, clobbering project instructions.
  agentRules: false,
  // Static export has no image optimization server; responsive sources have to
  // be pre-generated assets instead (docs §3.1, §4).
  images: { unoptimized: true },
  // GitHub Pages serves directories, not extensionless files.
  trailingSlash: true,
  basePath,
  assetPrefix: basePath || undefined,
};

module.exports = nextConfig;
