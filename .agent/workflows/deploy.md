---
description: How to deploy the Job Updates website to your domain
---

### 1. Choose a Hosting Provider
Since this is a Next.js app with a backend and database, you have two main options:

*   **Option A: Vercel (Recommended)** - Best performance, free tier, automatic SSL.
*   **Option B: VPS (DigitalOcean/Linode/Hostinger VPS)** - Full control, allows you to keep using SQLite.

---

### 2. Strategy for Vercel (Cloud Hosting)
Vercel is excellent, but it does not support SQLite files (data will be lost on每一次 rest). You should use a cloud database.

1.  **Get a Free Database**: Create a free PostgreSQL database on [Supabase](https://supabase.com) or [Neon.tech](https://neon.tech).
2.  **Update Database URL**: Replace the `DATABASE_URL` in your `.env` file with the connection string from Supabase/Neon.
3.  **Push to GitHub**:
    *   Initialize a git repo: `git init`
    *   Add files: `git add .`
    *   Commit: `git commit -m "initial commit"`
    *   Create a repo on GitHub and push.
4.  **Connect to Vercel**: Import the GitHub repo into Vercel.
5.  **Configure Domain**: In Vercel, go to **Settings > Domains** and add your domain.

---

### 3. Strategy for VPS (Traditional Hosting)
If you want to keep costs zero and use the local SQLite database:

1.  **Install Node.js & PM2** on your server.
2.  **Clone the Repository**.
3.  **Run Build**: `npm run build`.
4.  **Start with PM2**: `pm2 start npm --name "job-updates" -- start`.
5.  **Setup Nginx**: Configure Nginx as a reverse proxy to point your domain to the app.

---

### 4. Setting up Cron Jobs
To automate the job fetching:

*   **On Vercel**: Use [Vercel Cron Jobs](https://vercel.com/docs/cron-jobs) by adding a `vercel.json` file.
*   **On VPS**: Use a traditional linux crontab:
    `0 9 * * * curl https://yourdomain.com/api/cron/fetch`

---

**Which option would you like to proceed with? Tell me your domain name and I can help you configure the DNS records.**
