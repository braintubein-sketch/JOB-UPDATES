export async function register() {
    if (process.env.NEXT_RUNTIME === 'nodejs') {
        try {
            const { initializeCronJobs } = await import('./lib/automation');
            initializeCronJobs();
            console.log('[Instrumentation] Cron jobs successfully initialized');
        } catch (error) {
            console.error('[Instrumentation] Failed to initialize cron jobs:', error);
        }
    }
}
