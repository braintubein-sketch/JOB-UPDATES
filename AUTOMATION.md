# 🤖 Job Updates Automation Guide

This document explains how the automated job collection and distribution system works and how to manage it.

## 🚀 How it Works

The system runs autonomously using a multi-stage pipeline:

1.  **Fetcher (`lib/automation/engine.ts`)**: Polls RSS feeds from quality news sources.
2.  **Classifier (`lib/automation/classifier.ts`)**: 
    *   Determines if it's a Job, Result, or Admit Card.
    *   Detects Sector (IT, Bank, Railway, Police, etc.).
    *   Detects Experience Level (Fresher vs Experienced).
    *   Extracts Location and State.
    *   Generates a unique hash to prevent duplicates.
3.  **Generator**: Creates clean slugs and SEO-optimized descriptions.
4.  **Publisher**: Saves to MongoDB with `PUBLISHED` status.
5.  **Social Poster (`lib/automation/telegram.ts`)**: 
    *   Uses beautiful HTML templates.
    *   Posts to your Telegram channel automatically.
    *   Includes direct links to your website.

## 🔗 Automation Endpoints

You can trigger the automation manually or via CRON services:

| Endpoint | Purpose | Params |
| :--- | :--- | :--- |
| `/api/cron/run` | **Full Cycle** (Fetch + Post) | `secret`, `type` (hourly/2hours), `postOnly` |
| `/api/stats` | **Stats Dashboard** | None |
| `/api/jobs` | **Jobs API** | `category`, `search`, `limit`, `page` |

## 🛠️ Setting up Cron (Automatic Triggers)

To make the system truly 24/7, you should set up a cron job:

1.  **Using Render (Native Cron)**:
    *   Go to **Dashboard > New > Cron Job**.
    *   Command: `curl "https://your-domain.com/api/cron/run?secret=YOUR_CRON_SECRET"`
    *   Schedule: `0 * * * *` (Every hour).

2.  **Using Chron-job.org (Free)**:
    *   Create a job pointing to `https://your-domain.com/api/cron/run?secret=YOUR_CRON_SECRET`.
    *   Set to run every 1 hour.

## 📊 Monitoring

You can monitor the performance of the system via the `/api/stats` endpoint. It provides:
- Total records in database.
- Pending jobs to be posted to Telegram.
- Results of the last 10 automation runs (duration, status, items added).

## 🗄️ Database Models

- `Job`: Main job listings.
- `Result`: Exam results and merit lists.
- `AdmitCard`: Hall tickets and exam dates.
- `AutomationLog`: History of every fetch/post run.
- `ContentHash`: Global registry to prevent duplicate content across different sources.

## 🛑 Security

Ensure the `CRON_SECRET` environment variable is set in your Render dashboard. The cron endpoint will only work if the `secret` query parameter matches this value.
