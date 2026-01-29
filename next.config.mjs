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
        NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'https://jobupdate.site',
        NEXT_PUBLIC_SITE_NAME: process.env.NEXT_PUBLIC_SITE_NAME || 'JOB UPDATES',
    },
    // Optimization to save Render build minutes
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    // Standalone build for faster deploys
    output: 'standalone',
    // Enable instrumentation for background cron jobs
    experimental: {
        instrumentationHook: true,
    },
};

export default nextConfig;
