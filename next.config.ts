import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  agentRules: false,
  outputFileTracingRoot: process.cwd(),
  reactStrictMode: true,
};

export default nextConfig;
