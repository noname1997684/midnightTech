/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb", // Set the body size limit to 10MB
    },
  },
};

export default nextConfig;
