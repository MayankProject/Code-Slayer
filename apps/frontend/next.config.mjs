/** @type {import('next').NextConfig} */
import dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });
const nextConfig = {
  reactStrictMode: false,
};

export default nextConfig;
