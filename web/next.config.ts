import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  /* config options here */

  output: 'export',
  // Disable middleware
  skipMiddlewareUrlNormalize: true,
  skipTrailingSlashRedirect: true,
};

export default withNextIntl(nextConfig);
