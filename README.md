# 🦜 Meolingo — AI Language Learning App

A **Duolingo-inspired**, AI-powered language learning mobile app built with **Expo** and **React Native**. This is a practical teaching project designed to show developers how to build a feature-rich, production-quality mobile app — feature by feature.

---

## ✨ Overview

Meolingo helps users learn new languages through a variety of interactive lesson types powered by real AI. The experience is designed to feel playful, polished, and engaging — similar to Duolingo, but extended with modern AI capabilities like video AI teachers and live chat tutors.

> **This is a learning project.** The codebase is intentionally clean and approachable so developers can follow along and understand every decision.

---

## 🌍 Supported Languages

| Language | Status |
|---|---|
| 🇪🇸 Spanish | ✅ Active |
| 🇫🇷 French | ✅ Active |
| 🇯🇵 Japanese | ✅ Active |
| 🇰🇷 Korean | ✅ Active |
| 🇨🇳 Chinese | ✅ Active |
| 🇩🇪 German | 🔜 Coming Soon |

---

## 🧠 Lesson Types

Each language course contains multiple lesson units with a variety of interactive formats:

| Lesson Type | Description |
|---|---|
| 🎥 **Video AI Teacher** | Watch and interact with a virtual native-speaking AI teacher via live video |
| 🎧 **Audio Lesson** | Practice listening and speaking with guided audio dialogues |
| 💬 **Chat AI Tutor** | Real-time text roleplay with an AI conversation partner |
| 📚 **Vocabulary Review** | Flashcard-style review of key vocabulary and phrases |

---

## 🗂️ App Structure

```
app/
  (auth)/           # Sign-in and sign-up screens (Clerk)
  (tabs)/           # Main tab navigation
    index.tsx       # Home screen (daily goal, streak, today's plan)
    learn.tsx       # Lesson list and progress tracker
    ai-teacher.tsx  # AI teacher selection and video session
    chat.tsx        # AI chat tutor screen
    profile.tsx     # User profile, XP, achievements
  lesson/           # Individual lesson screens
    video.tsx       # Video AI teacher lesson
    audio.tsx       # Audio lesson player
    chat.tsx        # Chat lesson screen
    vocab.tsx       # Vocabulary review
  onboarding.tsx    # First-launch onboarding
  choose-language.tsx   # Language selection screen
  api/              # Server-side API routes (tokens, AI calls)

components/         # Reusable UI components
constants/          # Images, colors, PostHog client
data/               # Static lesson and language content (TypeScript)
store/              # Zustand global state (learning progress, XP)
types/              # TypeScript type definitions
assets/             # Images and fonts
```

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| [Expo](https://expo.dev) `~54` | Universal app framework |
| [React Native](https://reactnative.dev) `0.81` | Mobile UI rendering |
| [TypeScript](https://www.typescriptlang.org) | Type safety |
| [Expo Router](https://expo.github.io/router) | File-based navigation |
| [NativeWind](https://www.nativewind.dev) `v5` + Tailwind CSS `v4` | Styling |
| [Zustand](https://zustand-demo.pmnd.rs) | Global state management |
| [AsyncStorage](https://react-native-async-storage.github.io/async-storage/) | Persistent local storage |
| [Clerk](https://clerk.com) (`@clerk/expo`) | Authentication |
| [Stream Video SDK](https://getstream.io/video/docs/react-native/) | AI video teacher & live calls |
| [PostHog](https://posthog.com) | Product analytics |
| [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/) | Animations |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) (LTS recommended)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [Expo Go](https://expo.dev/go) app on your phone, or iOS Simulator / Android Emulator

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd mobile-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy the example file and fill in your credentials:

```bash
cp .env.example .env
```

```env
# .env
POSTHOG_PROJECT_TOKEN=phc_your_project_token_here
POSTHOG_HOST=https://us.i.posthog.com
```

You will also need to configure **Clerk** and **Stream** keys. Follow the service-specific setup guides below.

### 4. Start the development server

```bash
npm start
```

Then scan the QR code with Expo Go, or press `i` for iOS simulator / `a` for Android emulator.

---

## 🔐 Authentication (Clerk)

This app uses [Clerk](https://clerk.com) for authentication. To set it up:

1. Create a free Clerk account and application at [dashboard.clerk.com](https://dashboard.clerk.com)
2. Add your Clerk **Publishable Key** to your Expo config (`app.config.js` or environment variables)
3. Enable email/password and OAuth (Google, Apple) sign-in methods in the Clerk dashboard

Clerk provides:
- Email & password sign-up / sign-in
- Google and Apple OAuth
- Secure session tokens

---

## 🎥 AI Video Teacher (Stream)

Live video lessons are powered by [Stream Video React Native SDK](https://getstream.io/video/docs/react-native/). To enable this feature:

1. Create a [GetStream](https://getstream.io) account
2. Add your **Stream API Key** and generate user tokens server-side via the `/api` routes
3. Never expose your Stream **secret key** in the client

---

## 📊 Analytics (PostHog)

User behavior is tracked with [PostHog](https://posthog.com). Tracked events include:

- `learning_continued` — when a user resumes a lesson
- `user_signed_out` — when a user signs out
- Lesson completions and navigation events

---

## 🎮 Features

- **Onboarding** — Friendly welcome flow for new users
- **Language Selection** — Choose from 5 active languages with vibrant flag cards
- **Home Dashboard** — Daily goal tracker, streak counter, today's plan
- **Learn Tab** — Lesson list per language unit with XP progress
- **AI Video Teacher** — Select a teacher persona and start a live video lesson
- **Chat AI Tutor** — Real-time conversational AI for immersive practice
- **Audio Lessons** — Guided listening exercises with dialog transcripts
- **Vocabulary Review** — Interactive word cards with pronunciation guides
- **Profile & Achievements** — XP history, weekly activity chart, unlockable badges
- **Persistent Progress** — Completed lessons and XP saved locally with AsyncStorage

---

## 🧩 State Management

Global state is managed with **Zustand** and persisted via **AsyncStorage**:

```ts
// store/learningStore.ts
{
  selectedLanguageId: string | null  // Active learning language
  completedLessonIds: string[]       // All completed lesson IDs
  xp: number                         // Total experience points earned
}
```

---

## 📁 Content & Data

All lesson content is stored as static TypeScript files in `/data`:

| File | Contents |
|---|---|
| `languages.ts` | Language metadata (name, flag, accent color, learner count) |
| `lessons.ts` | All lesson definitions per language (type, goals, XP, vocabulary, activities) |
| `units.ts` | Course unit groupings per language |
| `audioDialogs.ts` | Audio lesson dialog scripts |

> No database is used. All content is local for simplicity and teachability.

---

## 🎨 Design System

- **Color Palette**: Deep indigo/purple (`#5B3BF6`, `#6C4EF5`) as the primary brand color, with warm accent colors per language
- **Typography**: [Poppins](https://fonts.google.com/specimen/Poppins) (Regular, Medium, SemiBold, Bold)
- **Styling**: NativeWind (Tailwind CSS v4) with a custom design token system in `global.css`
- **Animations**: React Native Reanimated for smooth transitions and micro-interactions

---

## 🧪 Linting

```bash
npm run lint       # ESLint
```

TypeScript is configured via `tsconfig.json` with strict mode enabled.

---

## 📱 Platform Support

| Platform | Support |
|---|---|
| iOS | ✅ Full support (includes tablet) |
| Android | ✅ Full support (minSdk 24+, edge-to-edge) |
| Web | ⚠️ Static export (limited features) |

---

## 📚 Learning Objectives

This project teaches developers how to build:

1. **Expo Router** file-based navigation with auth guards and tab layouts
2. **Clerk** authentication with OAuth and email/password flows
3. **Zustand + AsyncStorage** for persistent global state
4. **Stream Video SDK** integration for live video calling
5. **NativeWind v5** styling in React Native
6. **AI-powered features** (chat tutor, video teacher) via backend API routes
7. **PostHog** analytics integration in a mobile app
8. **Reusable component architecture** for a feature-driven mobile app

---

## 📄 License

This project is intended for educational purposes. All rights reserved.
