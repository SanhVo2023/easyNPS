# Gemini Feedback App - Netlify Deployment Guide

This interactive feedback engine is fully optimized for **Netlify** hosting. It operates as a fully serverless, secure client-side Single Page Application (SPA), utilizing Firebase Auth (Google OAuth) and the official Google Sheets & Drive REST APIs to save feedback data directly to your personal Google spreadsheets.

---

## 🚀 How to Deploy on Netlify

### 1. Push to GitHub
If you haven't initialized Git in your exported or local directory, run the following commands in your terminal:

```bash
# Initialize git repository
git init

# Add all project files
git add .

# Commit changes
git commit -m "Initialize Gemini Feedback App with Netlify support"

# Rename default branch to main
git branch -M main

# Link your remote GitHub repository and push
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

### 2. Import into Netlify
1. Log into your [Netlify Dashboard](https://app.netlify.com/).
2. Click **Add new site** -> **Import an existing project**.
3. Select **GitHub** as your provider and authorize Netlify.
4. Choose your repository (`YOUR_REPO_NAME`).
5. Netlify will automatically detect the settings from `netlify.toml`:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
6. Click **Deploy [Site Name]**.

---

## 🔒 Post-Deployment OAuth Whitelisting

Because this app uses **Firebase Auth (Google OAuth)** to write directly to your Google Sheets:
1. Copy your deployed Netlify URL (e.g., `https://your-custom-name.netlify.app`).
2. Go to your [Firebase Console](https://console.firebase.google.com/).
3. Navigate to **Authentication** -> **Settings** -> **Authorized domains**.
4. Add your Netlify domain (`your-custom-name.netlify.app`) to the list of authorized domains.
   - *Note: Without this, Google Auth will throw an error when attempting to sign in on your live Netlify site.*

---

## ⚙️ Environment Configuration

All of Firebase's public client configurations are safely stored in `firebase-applet-config.json` and bundled inline at build time, so no manual Environment Variables are strictly required in the Netlify Dashboard to run the primary app.

---

## 💻 Local Development

To run the application locally for further modifications:

```bash
# Install dependencies
npm install

# Run the local development server
npm run dev
```

Your app will default to `http://localhost:3000`. Keep building the future of AI!
