/** @type {import('next').NextConfig} */
const nextConfig = {
    // Image optimization
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
            },
        ],
    },

    // Compression
    compress: true,

    // Power by header
    poweredByHeader: false,

    // Strict mode for React
    reactStrictMode: true,

    // Environment variables validation
    env: {
        NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'https://jobupdates.com',
        NEXT_PUBLIC_SITE_NAME: process.env.NEXT_PUBLIC_SITE_NAME || 'JOB UPDATES',
    },
};

export default nextConfig;
