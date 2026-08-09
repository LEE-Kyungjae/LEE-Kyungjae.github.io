/** @type {import('next').NextConfig} */
const nextConfig = {
  agentRules: false,
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
