import { defineConfig } from 'next/config';

/** @type {import('next').NextConfig} */
const config = {
  experimental: {
    appDir: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default config;
