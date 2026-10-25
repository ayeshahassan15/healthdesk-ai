# HealthDesk AI

An AI-powered wellness assistant that gives symptom guidance, health tips, and a friendly health chat. Built for the **AI Seekho 2026 Hackathon** (winner).

**Live demo:** https://healthdesk-ai-beta.vercel.app

> HealthDesk AI is not a substitute for professional medical advice.

## Features

- **Symptom Checker:** describe your symptoms and get a streamed answer with a severity label (mild, moderate, urgent) and a wellness score
- **Wellness Chat:** a multi-turn health chat that remembers the conversation
- **Wellness Dashboard:** daily health metrics, a BMI calculator, and a health tip of the day
- **Safety first:** the AI always says it is not a doctor and tells users to call emergency services for serious symptoms

## Tech Stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS
- **Backend:** serverless API function (`api/chat.ts`) that keeps the AI key on the server
- **AI:** Groq API (`openai/gpt-oss-20b`) with streaming responses
- **Database:** Firebase Firestore
- **Hosting:** Vercel

## Run Locally

**Prerequisites:** Node.js 20 or newer

1. Install dependencies:
   ```
   npm install
   ```
2. Create a `.env` file in the main folder and add your Groq API key (get one at https://console.groq.com):
   ```
   GROQ_API_KEY=your_key_here
   ```
3. Start the app:
   ```
   npm run dev
   ```
4. Open http://localhost:3000

## Project Structure

```
api/chat.ts        Serverless function that calls Groq (key stays hidden)
src/services/      Frontend helpers that call /api/chat
src/               React pages and components
server.ts          Local dev server (runs the app and the API together)
```

## Deploy

The app is deployed on Vercel. Add `GROQ_API_KEY` in Project Settings, Environment Variables, then deploy.