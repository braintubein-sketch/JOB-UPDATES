/**
 * TELEGRAM AUTO-POSTING SERVICE
 * Production-grade Telegram integration with category-specific templates
 */

import dbConnect from '../mongodb/dbConnect';
import { Job } from '../../models/Job';
import { Result, AdmitCard, AutomationLog } from '../../models/Automation';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID;
const SITE_URL = 'https://jobupdate.site';

// ============================================
// MESSAGE TEMPLATES (HTML Format)
// ============================================

function formatJobMessage(job: any): string {
    const jobUrl = `${SITE_URL}/jobs/${job.slug}`;
    const lastDate = job.lastDate
        ? new Date(job.lastDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
        : 'Check Notice';

    // IT Job Template
    if (job.category === 'IT') {
        return [
            `💻 <b>IT JOB OPENING</b>`,
            ``,
            `🏢 <b>Company:</b> ${job.organization}`,
            `👨‍💻 <b>Role:</b> ${job.postName || job.title}`,
            `💰 <b>Salary:</b> ${job.salary || 'Best in Industry'}`,
            `💼 <b>Experience:</b> ${job.experience || 'Freshers / Experienced'}`,
            `📍 <b>Location:</b> ${job.location || 'India'}`,
            ``,
            `🔗 <b>Apply Now:</b>`,
            `${jobUrl}`,
            ``,
            `#ITJobs #Software #Developer #Hiring`,
        ].join('\n');
    }

    // Banking Job Template
    if (job.category === 'Banking') {
        return [
            `🏦 <b>BANK JOB ALERT</b>`,
            ``,
            `🏢 <b>Bank:</b> ${job.organization}`,
            `📌 <b>Post:</b> ${job.postName || job.title}`,
            `🎓 <b>Qualification:</b> ${job.qualification || 'Graduate'}`,
            `📍 <b>Location:</b> ${job.location || 'All India'}`,
            `📅 <b>Last Date:</b> ${lastDate}`,
            ``,
            `🔗 <b>Full Details:</b>`,
            `${jobUrl}`,
            ``,
            `#BankJobs #IBPS #SBI #RBI #Banking`,
        ].join('\n');
    }

    // Railway Job Template
    if (job.category === 'Railway') {
        return [
            `🚂 <b>RAILWAY RECRUITMENT</b>`,
            ``,
            `🏢 <b>Organization:</b> ${job.organization}`,
            `📌 <b>Post:</b> ${job.postName || job.title}`,
            `📊 <b>Vacancies:</b> ${job.vacancies || 'Multiple'}`,
            `🎓 <b>Qualification:</b> ${job.qualification || 'See Notification'}`,
            `📅 <b>Last Date:</b> ${lastDate}`,
            ``,
            `🔗 <b>Apply Online:</b>`,
            `${jobUrl}`,
            ``,
            `#RailwayJobs #RRB #IndianRailways`,
        ].join('\n');
    }

    // Police/Defence Template
    if (job.category === 'Police' || job.category === 'Defence') {
        return [
            `🛡️ <b>DEFENCE/POLICE RECRUITMENT</b>`,
            ``,
            `🏢 <b>Organization:</b> ${job.organization}`,
            `📌 <b>Post:</b> ${job.postName || job.title}`,
            `📊 <b>Vacancies:</b> ${job.vacancies || 'Check Notice'}`,
            `🎓 <b>Qualification:</b> ${job.qualification || 'See Notification'}`,
            `📅 <b>Last Date:</b> ${lastDate}`,
            ``,
            `🔗 <b>Full Notice:</b>`,
            `${jobUrl}`,
            ``,
            `#Police #Defence #Army #CRPF #BSF`,
        ].join('\n');
    }

    // PSU Job Template
    if (job.category === 'PSU') {
        return [
            `🏭 <b>PSU JOB NOTIFICATION</b>`,
            ``,
            `🏢 <b>PSU:</b> ${job.organization}`,
            `📌 <b>Post:</b> ${job.postName || job.title}`,
            `📊 <b>Vacancies:</b> ${job.vacancies || 'Multiple'}`,
            `💰 <b>Salary:</b> ${job.salary || 'As per PSU norms'}`,
            `📅 <b>Last Date:</b> ${lastDate}`,
            ``,
            `🔗 <b>Apply:</b>`,
            `${jobUrl}`,
            ``,
            `#PSU #NTPC #ONGC #BHEL #DRDO`,
        ].join('\n');
    }

    // Teaching Job Template
    if (job.category === 'Teaching') {
        return [
            `📚 <b>TEACHING JOB</b>`,
            ``,
            `🏫 <b>Organization:</b> ${job.organization}`,
            `👨‍🏫 <b>Post:</b> ${job.postName || job.title}`,
            `🎓 <b>Qualification:</b> ${job.qualification || 'B.Ed / M.Ed'}`,
            `📍 <b>Location:</b> ${job.location || 'India'}`,
            `📅 <b>Last Date:</b> ${lastDate}`,
            ``,
            `🔗 <b>Apply:</b>`,
            `${jobUrl}`,
            ``,
            `#TeachingJobs #Teacher #Faculty #KVS #NVS`,
        ].join('\n');
    }

    // Default Government Job Template
    return [
        `🔥 <b>NEW JOB UPDATE</b>`,
        ``,
        `📌 <b>${job.postName || job.title}</b>`,
        `🏢 <b>Organization:</b> ${job.organization}`,
        `🎓 <b>Qualification:</b> ${job.qualification || 'See Notification'}`,
        `🧑‍💼 <b>Experience:</b> ${job.experience || 'Freshers'}`,
        `📍 <b>Location:</b> ${job.location || 'All India'}`,
        `💰 <b>Salary:</b> ${job.salary || 'As per norms'}`,
        `📅 <b>Last Date:</b> ${lastDate}`,
        ``,
        `👉 <b>Apply Here:</b>`,
        `${jobUrl}`,
        ``,
        `🌐 More Jobs: ${SITE_URL}`,
    ].join('\n');
}

function formatResultMessage(result: any): string {
    const resultUrl = `${SITE_URL}/results/${result.slug}`;
    const releaseDate = result.releaseDate
        ? new Date(result.releaseDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
        : 'Today';

    return [
        `✅ <b>RESULT DECLARED</b>`,
        ``,
        `📝 <b>${result.examName}</b>`,
        `🏢 <b>Organization:</b> ${result.organization}`,
        `📅 <b>Date:</b> ${releaseDate}`,
        ``,
        `👉 <b>Check Result:</b>`,
        `${result.resultLink || resultUrl}`,
        ``,
        `#Result #ExamResult #${result.organization?.replace(/\s+/g, '')}`,
    ].join('\n');
}

function formatAdmitCardMessage(admitCard: any): string {
    const admitUrl = `${SITE_URL}/admit-cards/${admitCard.slug}`;
    const examDate = admitCard.examDate
        ? new Date(admitCard.examDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
        : 'Check Notice';

    return [
        `🎫 <b>ADMIT CARD RELEASED</b>`,
        ``,
        `📝 <b>${admitCard.examName}</b>`,
        `🏢 <b>Organization:</b> ${admitCard.organization}`,
        `📅 <b>Exam Date:</b> ${examDate}`,
        ``,
        `👉 <b>Download:</b>`,
        `${admitCard.downloadLink || admitUrl}`,
        ``,
        `#AdmitCard #HallTicket #Exam`,
    ].join('\n');
}

// ============================================
// TELEGRAM API
// ============================================

async function sendTelegramMessage(message: string): Promise<{ success: boolean; error?: string }> {
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHANNEL_ID) {
        return { success: false, error: 'Telegram not configured' };
    }

    try {
        const response = await fetch(
            `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: TELEGRAM_CHANNEL_ID,
                    text: message,
                    parse_mode: 'HTML',
                    disable_web_page_preview: false,
                }),
            }
        );

        const result = await response.json();
        if (result.ok) return { success: true };
        return { success: false, error: result.description };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

// ============================================
// AUTO POST ENGINE
// ============================================

export interface PostResult {
    jobsPosted: number;
    resultsPosted: number;
    admitCardsPosted: number;
    errors: number;
    duration: number;
}

export async function runTelegramPostCycle(): Promise<PostResult> {
    const startTime = Date.now();
    await dbConnect();

    let jobsPosted = 0;
    let resultsPosted = 0;
    let admitCardsPosted = 0;
    let errors = 0;

    console.log(`\n${'='.repeat(60)}`);
    console.log(`📢 TELEGRAM POST CYCLE STARTED - ${new Date().toISOString()}`);
    console.log(`${'='.repeat(60)}\n`);

    // 1. Post unposted Jobs (limit 5 per cycle for rate limiting)
    const unpostedJobs = await Job.find({
        status: 'PUBLISHED',
        telegramPosted: { $ne: true }
    }).limit(5).sort({ createdAt: -1 });

    for (const job of unpostedJobs) {
        const message = formatJobMessage(job);
        const result = await sendTelegramMessage(message);

        if (result.success) {
            await Job.updateOne({ _id: job._id }, { telegramPosted: true, publishedAt: new Date() });
            console.log(`✅ Posted Job: ${job.title.substring(0, 50)}...`);
            jobsPosted++;
        } else {
            console.log(`❌ Failed Job: ${result.error}`);
            errors++;
        }

        await new Promise(r => setTimeout(r, 2000)); // Rate limit: 2 seconds between posts
    }

    // 2. Post unposted Results (limit 3)
    const unpostedResults = await Result.find({
        status: 'PUBLISHED',
        telegramPosted: { $ne: true }
    }).limit(3).sort({ createdAt: -1 });

    for (const result of unpostedResults) {
        const message = formatResultMessage(result);
        const postResult = await sendTelegramMessage(message);

        if (postResult.success) {
            await Result.updateOne({ _id: result._id }, { telegramPosted: true });
            console.log(`✅ Posted Result: ${result.examName.substring(0, 50)}...`);
            resultsPosted++;
        } else {
            console.log(`❌ Failed Result: ${postResult.error}`);
            errors++;
        }

        await new Promise(r => setTimeout(r, 2000));
    }

    // 3. Post unposted Admit Cards (limit 3)
    const unpostedAdmitCards = await AdmitCard.find({
        status: 'PUBLISHED',
        telegramPosted: { $ne: true }
    }).limit(3).sort({ createdAt: -1 });

    for (const admitCard of unpostedAdmitCards) {
        const message = formatAdmitCardMessage(admitCard);
        const postResult = await sendTelegramMessage(message);

        if (postResult.success) {
            await AdmitCard.updateOne({ _id: admitCard._id }, { telegramPosted: true });
            console.log(`✅ Posted Admit Card: ${admitCard.examName.substring(0, 50)}...`);
            admitCardsPosted++;
        } else {
            console.log(`❌ Failed Admit Card: ${postResult.error}`);
            errors++;
        }

        await new Promise(r => setTimeout(r, 2000));
    }

    const duration = Date.now() - startTime;

    // Log the run
    await AutomationLog.create({
        runType: 'TELEGRAM_POST',
        status: errors > 0 && (jobsPosted + resultsPosted + admitCardsPosted) === 0 ? 'FAILED' : 'COMPLETED',
        stats: {
            posted: jobsPosted + resultsPosted + admitCardsPosted,
            errors
        },
        duration
    });

    console.log(`\n${'='.repeat(60)}`);
    console.log(`✅ TELEGRAM POST CYCLE COMPLETED in ${(duration / 1000).toFixed(1)}s`);
    console.log(`📊 Jobs=${jobsPosted}, Results=${resultsPosted}, AdmitCards=${admitCardsPosted}, Errors=${errors}`);
    console.log(`${'='.repeat(60)}\n`);

    return { jobsPosted, resultsPosted, admitCardsPosted, errors, duration };
}

// ============================================
// MANUAL POST FUNCTION
// ============================================

export async function postJobById(jobId: string): Promise<{ success: boolean; error?: string }> {
    await dbConnect();
    const job = await Job.findById(jobId);
    if (!job) return { success: false, error: 'Job not found' };

    const message = formatJobMessage(job);
    const result = await sendTelegramMessage(message);

    if (result.success) {
        await Job.updateOne({ _id: jobId }, { telegramPosted: true });
    }

    return result;
}
