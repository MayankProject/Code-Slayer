/** @type {import('next').NextConfig} */
import dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });
const nextConfig = {
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
