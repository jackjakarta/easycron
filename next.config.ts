import { type NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  allowedDevOrigins: ['jakarta.ngrok.app'],
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
