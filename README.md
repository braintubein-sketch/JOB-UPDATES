# 🚀 JOB UPDATES - Premium IT Jobs Portal

**JOB UPDATES** is a high-performance, ultra-premium job portal dedicated to the Indian IT ecosystem. Built with Next.js 15+, Tailwind CSS 4, and Framer Motion.

## ✨ Features
- **Premium UI**: Modern glassmorphism design with Plus Jakarta Sans typography.
- **Lightning Fast**: Optimized for speed and mobile performance.
- **Verified Jobs**: Hand-curated tech opportunities from top companies.
- **Real-time Alerts**: Integration ready for Telegram notifications.

## 🛠️ Tech Stack
- **Frontend**: Next.js 15, Tailwind CSS 4, Framer Motion, Lucide Icons.
- **Backend**: Next.js API Routes (Serverless).
- **Database**: MongoDB (Mongoose).
- **Styling**: CSS-first Tailwind 4 configuration.

## 🚀 Getting Started

1. **Clone the repository**
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Configure Environment**: Create a `.env` file based on `.env.example`.
4. **Run Development Server**:
   ```bash
   npm run dev
   ```

## 🌐 Deployment (Render)

To deploy this project on Render:

1. Create a **New Web Service** (connect this GitHub repo).
2. Set **Environment** to `Node`.
3. Set **Build Command**: `npm install && npm run build`.
4. Set **Start Command**: `npm run start`.
5. Add the following **Environment Variables**:
   - `MONGODB_URI`: Your MongoDB connection string.
   - `JWT_SECRET`: A random secure string.
   - `NEXT_PUBLIC_SITE_URL`: `https://jobupdate.site`
   - `NEXT_PUBLIC_SITE_NAME`: `JOB UPDATES`

## 📄 License
Custom proprietary license for JOB UPDATES.
