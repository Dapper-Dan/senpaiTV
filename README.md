
# 📺 SenpaiTV

A mock anime streaming platform that unifies discovery, watch tracking, and streaming experience in a single sleek app. SenpaiTV simulates what Crunchyroll *should* feel like — clean, customizable, and fully integrated with your anime tracker.

---

## Overview

**SenpaiTV** is a fictional streaming service that mimics real anime platforms like Crunchyroll, Netflix, and HIDIVE. It hosts trailers or mock content in place of full episodes, while integrating directly with **AniList** and **MyAnimeList** to manage your real watch progress and lists.

Instead of linking users out, SenpaiTV offers simulated platform access through a mock authentication flow — creating a unified, immersive viewing experience with zero API limitations or legal friction.

---

## Problems It Solves

- Anime is scattered across streaming platforms
- Users juggle multiple services + tracker sites
- Crunchyroll’s UX is cluttered, MyAnimeList is outdated
- There's no single place to browse, queue, and track across platforms

---

## Features

### Mock Streaming Experience

- Real anime titles from AniList/MAL APIs
- Hero banners, trending sections, search, filters
- Simulated playback using trailers or placeholder video
- Watch prompts that update your real tracker data

### Tracker Integration

- OAuth2 login with MyAnimeList or AniList
- Sync “Watching”, “Completed”, “Plan to Watch”
- Track progress from inside SenpaiTV

### Cross-Platform Subscription Logic

- Anime shows tagged with available platforms (Crunchyroll, Netflix, etc.)
- Simulated subscription system with per-user access flags
- "Not Subscribed?" triggers mock paywall / call to action

### Personalized UX

- Mood tags (“hype”, “cozy”, “dark”, etc.)
- Resume shelf and watch stats

---

## 🛠 Tech Stack

| Layer         | Tools Used                       |
|---------------|----------------------------------|
| Frontend      | React / Next.js, Tailwind CSS    |
| State         | Zustand or Context API           |
| API Integration | AniList GraphQL, MAL REST      |
| Auth          | OAuth2 for AniList / MAL         |
| Backend       | Firebase or Supabase (optional)  |
| Hosting       | Vercel or Netlify                |

---

## ⚖️ Legal & Ethical Design

- All streaming content is mocked (trailers only)
- No copyrighted material
- All third-party auth is real (MAL, AniList)
- No actual Crunchyroll branding or API usage

---
