# LibroAI - App Setup & Build Guide

Complete documentation of every step taken to build LibroAI from foundation to production on both App Store and Google Play.

---

## Table of Contents

1. [Project Foundation](#1-project-foundation)
2. [Vue.js & Frontend Stack](#2-vuejs--frontend-stack)
3. [Vuetify Theme & Design System](#3-vuetify-theme--design-system)
4. [Routing & State Management](#4-routing--state-management)
5. [Capacitor Mobile Bridge](#5-capacitor-mobile-bridge)
6. [iOS Setup & App Store](#6-ios-setup--app-store)
7. [Android Setup & Google Play](#7-android-setup--google-play)
8. [Firebase & Push Notifications](#8-firebase--push-notifications)
9. [RevenueCat Subscriptions](#9-revenuecat-subscriptions)
10. [AdMob Advertising](#10-admob-advertising)
11. [Analytics (Amplitude & GA)](#11-analytics-amplitude--ga)
12. [Backend API](#12-backend-api)
13. [Services Architecture](#13-services-architecture)
14. [Build Scripts & Commands](#14-build-scripts--commands)
15. [Environment Variables](#15-environment-variables)

---

## 1. Project Foundation

### Tech Stack

| Layer             | Technology          | Version  |
|-------------------|---------------------|----------|
| Framework         | Vue.js 3            | 3.4.21   |
| UI Library        | Vuetify 3           | 3.5.17   |
| State Management  | Pinia               | 2.1.7    |
| Build Tool        | Vite                | 5.2.8    |
| Mobile Bridge     | Capacitor           | 7.2.0    |
| CSS Preprocessor  | Sass                | 1.72.0   |
| HTTP Client       | Axios               | 1.6.8    |
| Node.js           | >= 18               |          |

### Project Initialization

The project was bootstrapped from a Capacitor + Vue template (originally a currency converter app) and repurposed for LibroAI.

```bash
npm install
```

### Vite Configuration (`vite.config.js`)

- **Base URL:** `''` (empty for hash-based routing compatible with Capacitor)
- **Output Directory:** `dist/`
- **Sourcemaps:** enabled in production
- **Custom plugin:** strips query strings from font URLs (fixes iOS WKWebView font loading)
- **App version:** injected from `package.json` as `__APP_VERSION__`

---

## 2. Vue.js & Frontend Stack

### Dependencies

**Core:**
- `vue` 3.4.21
- `vue-router` 4.3.0
- `vuetify` 3.5.17
- `pinia` 2.1.7
- `pinia-plugin-persistedstate` 3.2.1

**UI:**
- `@mdi/font` 7.4.47 - Material Design Icons
- `@mdi/js` 7.4.47
- `@vueuse/head` 2.0.0 - Meta tags
- `vue-confetti-explosion` 1.0.2
- `driver.js` 1.4.0 - Onboarding feature tours

### App Initialization Flow (`src/main.js`)

1. Create Pinia store with persistence plugin
2. Create Vue Head instance
3. Create Vue app, register plugins (Pinia, Router, Vuetify, Head)
4. Setup auth HTTP interceptor
5. Initialize authentication (device-based auto-registration)
6. Initialize subscription service
7. On mobile: setup push notification listeners, show splash screen (1s), request ATT on iOS (1.5s delay)

### Component Pattern

All components use `<script setup>` (Composition API):

```vue
<script setup>
import { ref, computed } from 'vue'
import { useStoriesStore } from '@/store/stories'
import { storeToRefs } from 'pinia'

const store = useStoriesStore()
const { someState } = storeToRefs(store)
</script>
```

---

## 3. Vuetify Theme & Design System

### Theme Configuration (`src/plugins/vuetify.js`)

**Dark Theme (default):**

| Token       | Value     |
|-------------|-----------|
| Primary     | `#F57C00`  |
| Secondary   | `#1976D2`  |
| Accent      | `#FF9800`  |
| Background  | `#1E1E1E`  |
| Surface     | `#1E1E1E`  |

**Light Theme:**

| Token       | Value     |
|-------------|-----------|
| Primary     | `#D35400`  |
| Secondary   | `#1565C0`  |
| Background  | `#FAF8F5`  |
| Surface     | `#FFFDF9`  |

### Typography

- **UI Font:** Inter (Google Fonts)
- **Reading Font:** Literata (Google Fonts) - optimized for long-form reading
- **Story Text:** 19px, line-height 1.8, letter-spacing 0.01em

### Icons

Material Design Icons (`@mdi/font`) loaded via Vuetify icon set configuration.

---

## 4. Routing & State Management

### Router (`src/router/index.js`)

Hash-based history mode (`createWebHashHistory`), scroll to top on navigation.

| Route               | View       | Purpose           |
|----------------------|------------|-------------------|
| `/`                  | Dashboard  | Home / stats      |
| `/stories`           | Stories    | Story reader      |
| `/settings`          | Settings   | App settings      |
| `/:pathMatch(.*)*`   | Dashboard  | Fallback redirect |

### Pinia Stores

All stores persist selected paths via `pinia-plugin-persistedstate` with `libroai-` key prefix.

**App Store** (`src/store/app.js`)
- State: `loading`, `darkMode`
- Persisted: `darkMode`

**Auth Store** (`src/store/auth.js`)
- State: `token`, `user`
- Persisted: `token`, `user`

**Stories Store** (`src/store/stories.js`)
- State: languages, current story, translation cache, audio state, tooltip state
- Persisted: `sourceLanguage`, `targetLanguage`, `translationCache`, `currentStory`, `currentStoryTopic`, `currentStoryDifficulty`
- Default: source=English, target=Spanish
- Supported languages: English, Spanish, French, German, Italian, Portuguese, Japanese, Korean, Chinese, Arabic, Hindi

**Dashboard Store** (`src/store/dashboard.js`)
- State: topics, difficulty, learning stats, streak
- Persisted: `selectedTopics`, `selectedDifficulty`, daily stats, streak data
- 24 available topics, 3 difficulty levels (beginner, intermediate, expert)

**Subscription Store** (`src/store/subscription.js`)
- State: `isPremium`, `offerings`, daily usage counters, bonus counters
- Persisted: usage and bonus counters, `lastUsageDate`
- Free tier: 15 translations/day, 1 story/day

---

## 5. Capacitor Mobile Bridge

### Configuration (`capacitor.config.json`)

```json
{
  "appId": "com.libroai.app",
  "appName": "LibroAI",
  "webDir": "dist"
}
```

### Capacitor Plugins Installed

| Plugin                                   | Version | Purpose                     |
|------------------------------------------|---------|-----------------------------|
| `@capacitor/core`                        | 7.2.0   | Core bridge                 |
| `@capacitor/ios`                         | 7.2.0   | iOS platform                |
| `@capacitor/android`                     | 7.4.5   | Android platform            |
| `@capacitor/device`                      | 7.0.4   | Device info & ID            |
| `@capacitor/push-notifications`          | 7.0.1   | Push notifications          |
| `@capacitor/preferences`                 | 7.0.1   | Device storage              |
| `@capacitor/splash-screen`              | 7.0.1   | Splash screen               |
| `@capacitor/status-bar`                 | 7.0.1   | Status bar control          |
| `@capacitor/haptics`                     | 7.0.0   | Haptic feedback             |
| `@capacitor-community/admob`            | 8.0.0   | Google AdMob                |
| `@capacitor-community/in-app-review`    | 7.0.1   | App Store / Play reviews    |
| `@capacitor-firebase/messaging`         | 7.5.0   | Firebase Cloud Messaging    |
| `@revenuecat/purchases-capacitor`       | 11.3.2  | In-app purchases            |
| `capacitor-plugin-app-tracking-transparency` | 3.0.0 | iOS ATT prompt           |

### Splash Screen Config

- Duration: 1000ms
- Auto-hide: false (hidden manually)
- Full screen + immersive mode
- Android resource: "splash"

---

## 6. iOS Setup & App Store

### App Identity

| Field              | Value                                                      |
|--------------------|------------------------------------------------------------|
| Bundle ID          | `com.libroai.app`                                          |
| App Name           | LibroAI                                                    |
| Development Team   | `482YD3G9Z6`                                               |
| Min iOS Version    | 15.0                                                       |
| App Store Link     | https://apps.apple.com/us/app/libroai-learn-by-reading/id6758308600 |
| App Store ID       | 6758308600                                                 |

### Xcode Project

- Open workspace: `open ios/App/App.xcworkspace`
- Storyboards: `Main.storyboard` (app) + `LaunchScreen.storyboard` (splash)
- Supported orientations: portrait + landscape (iPhone/iPad)

### CocoaPods (`ios/App/Podfile`)

Key pods installed:
- Capacitor core + plugins
- `RevenuecatPurchasesCapacitor` (11.3.2) with `PurchasesHybridCommon` (17.25.0) and `RevenueCat` (5.51.1)
- `Firebase/Core` + `Firebase/Messaging`
- `Google-Mobile-Ads-SDK`
- `CapacitorPluginAppTrackingTransparency`

### Info.plist Configuration

- **GADApplicationIdentifier:** `ca-app-pub-1402799140473121~3676694853`
- **NSUserTrackingUsageDescription:** ATT permission prompt text
- **SKAdNetworkItems:** `cstr6suwn9.skadnetwork`
- **UIBackgroundModes:** `remote-notification`

### App Icon & Splash

Source images in `assets/` folder:

| File              | Size          | Purpose                |
|-------------------|---------------|------------------------|
| `logo.png`        | 1024x1024px   | App icon               |
| `icon-only.png`   | 1024x1024px   | Icon variant           |
| `splash.png`      | 2732x2732px   | Splash screen          |
| `splash-dark.png` | 2732x2732px   | Dark mode splash       |

Generate assets:
```bash
npx capacitor-assets generate --ios \
  --iconBackgroundColor '#1E1E1E' \
  --splashBackgroundColor '#121212'
```

> **Note:** Source icon must have no rounded corners or transparency. iOS applies its own corner mask.

### Build & Submit

```bash
npm run build:ios     # Build Vue + sync Capacitor
open ios/App/App.xcworkspace  # Open in Xcode
# Archive via Xcode -> Product -> Archive -> Distribute to App Store
```

---

## 7. Android Setup & Google Play

### App Identity

| Field            | Value                  |
|------------------|------------------------|
| Package Name     | `com.libroai.app`      |
| Application ID   | `com.libroai.app`      |
| Version Name     | `1.1.5`                |
| Version Code     | `20`                   |
| Min SDK          | 23                     |
| Target SDK       | 35                     |
| Compile SDK      | 35                     |

### Gradle Configuration

**`android/variables.gradle`:**
- `minSdkVersion = 23`
- `compileSdkVersion = 35`
- `targetSdkVersion = 35`

**`android/app/build.gradle`:**
- Namespace: `com.libroai.app`
- Signing config with release keystore
- Proguard disabled
- Google Services plugin (conditional on `google-services.json` existence)

### Release Signing

Keystore stored at `keystores/libroai-upload.keystore`:

| Field             | Value                              |
|-------------------|------------------------------------|
| Keystore Path     | `keystores/libroai-upload.keystore` |
| Key Alias         | `libroai`                          |
| Keystore Password | `LibroAI2024!`                     |
| Key Password      | `LibroAI2024!`                     |

Upload certificate: `keystores/upload_certificate.pem`

> **Note:** Original upload key was lost. Key reset was requested via Play Console (App integrity -> App signing). New upload key valid from March 12, 2026.

### Android Manifest

Required permissions:
```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="com.android.vending.BILLING" />
```

AdMob meta-data:
```xml
<meta-data
    android:name="com.google.android.gms.ads.APPLICATION_ID"
    android:value="ca-app-pub-1402799140473121~3676694853"
/>
```

### Android UI Considerations

- `backdrop-filter: blur()` disabled on Android (causes WebView glitches)
- Solid backgrounds used instead of glass-morphism
- Extra bottom padding on Dashboard for navigation clearance on Samsung devices

### Build & Submit

```bash
npm run build:android           # Debug build
npm run build:android:release   # Release AAB for Play Store
# OR
./scripts/build/android/start.sh -b   # Full release build
```

The release AAB is output to `android/app/build/outputs/bundle/release/`.

---

## 8. Firebase & Push Notifications

### Firebase Project

| Field           | Value                                    |
|-----------------|------------------------------------------|
| Project Name    | libro-ai-app                             |
| Project ID      | libro-ai-app                             |
| GCM Sender ID   | 665249793440                            |
| Storage Bucket  | libro-ai-app.firebasestorage.app         |

### iOS Firebase Config (`ios/App/App/GoogleService-Info.plist`)

| Field           | Value                                            |
|-----------------|--------------------------------------------------|
| API Key         | `AIzaSyCncxg_lavU2p6KeSyfh5m58iHuqw9JnPA`       |
| Google App ID   | `1:665249793440:ios:2df34c4a5a4ad4917410c5`      |
| Bundle ID       | `com.libroai.app`                                |

### Android Firebase Config (`android/app/google-services.json`)

| Field           | Value                                            |
|-----------------|--------------------------------------------------|
| API Key         | `AIzaSyDIudEC-AUCRpeoKWjtfpDhL46YjJ13Vnk`       |
| Mobile SDK ID   | `1:665249793440:android:1f718e85f92a1b657410c5`  |
| Package Name    | `com.libroai.app`                                |

### APNs (iOS Push)

| Field       | Value          |
|-------------|----------------|
| APNs Key ID | `2R98A9U83S`   |
| Team ID     | `482YD3G9Z6`   |

Upload the APNs key (.p8 file) in Firebase Console -> Project Settings -> Cloud Messaging.

### Push Notification Service (`src/services/notifications.js`)

- Registers device for push on app launch
- Subscribes to FCM topics: `all_users`, `ios_users` or `android_users`
- Handles deep linking from notification tap
- Haptic feedback on notification receipt
- Tracks notification opens in Amplitude
- Detects cold-start vs foreground notifications

### iOS AppDelegate

`ios/App/App/AppDelegate.swift` includes:
- Firebase initialization (`FirebaseApp.configure()`)
- Push notification delegate methods
- APNs token forwarding to Firebase Messaging

---

## 9. RevenueCat Subscriptions

### RevenueCat Configuration

| Field              | Value                                        |
|--------------------|----------------------------------------------|
| iOS API Key        | `appl_AvEzTEtrHiwVSWEQKMKQbhKnytZ`          |
| Android API Key    | `goog_uHjlyAaZAUGRXESYeLTaczEcEYU`           |
| Entitlement ID     | `premium`                                    |
| SDK                | `@revenuecat/purchases-capacitor` 11.3.2      |

### Platform-Aware Initialization (`src/services/subscription.js`)

The service detects the current platform and uses the correct API key:
- iOS -> `VITE_REVENUECAT_API_KEY_IOS`
- Android -> `VITE_REVENUECAT_API_KEY_ANDROID`
- Web/dev -> skips initialization, returns premium = true

### Subscription Store (`src/store/subscription.js`)

Manages:
- Premium status checks via RevenueCat entitlements
- Offering/package fetching
- Purchase flow
- Restore purchases
- Daily usage tracking (translations, stories)
- Bonus credits from rewarded ads

### Free vs Premium

| Feature              | Free            | Premium    |
|----------------------|-----------------|------------|
| Translations/day     | 15              | Unlimited  |
| Stories/day           | 1               | Unlimited  |
| Ads                  | Banner + Rewarded | None     |
| Future features      | No              | Yes        |

### Paywall UI (`src/components/Paywall/index.vue`)

- Full-screen dialog with gradient background
- 7-day free trial messaging
- Monthly + Annual plans (Annual has "BEST VALUE" badge)
- Radio-button plan selection
- Restore Purchases button
- Platform-aware legal text (Apple ID / Google Play)
- Platform-aware Terms of Use link
- Trust indicators (secure payment, cancel anytime)
- Social proof (4.9 star rating)

### RevenueCat Dashboard Setup

1. **iOS App:** Create in RevenueCat, add App Store Connect API key, configure products
2. **Android App:** Create in RevenueCat, upload Google Play service account JSON key
3. **Products:** Create subscription products in App Store Connect and Google Play Console
4. **Entitlements:** Map all products to the `premium` entitlement
5. **Offerings:** Create a "default" offering with Monthly and Annual packages

---

## 10. AdMob Advertising

### AdMob IDs

| ID Type          | Value                                         |
|------------------|-----------------------------------------------|
| App ID           | `ca-app-pub-1402799140473121~3676694853`       |
| Banner Unit      | `ca-app-pub-1402799140473121/9871567535`        |
| Interstitial Unit| `ca-app-pub-1402799140473121/9328584584`        |
| Rewarded Unit    | `ca-app-pub-1402799140473121/2632507234`        |

Same ad unit IDs used for both iOS and Android.

### Ad Service (`src/services/ads.js`)

- Banner ads shown on Stories view (free users only, hidden for premium)
- Interstitial ads: prepared and shown between actions
- Rewarded ads: users watch to earn bonus translations/stories
- ATT permission requested on iOS before ad initialization
- Status bar restored after full-screen ad dismissal
- Testing mode: currently disabled

### Platform Configuration

**iOS:** `GADApplicationIdentifier` in `Info.plist` + `SKAdNetworkItems`

**Android:** `<meta-data>` in `AndroidManifest.xml` for `com.google.android.gms.ads.APPLICATION_ID`

---

## 11. Analytics (Amplitude & GA)

### Amplitude (`src/services/amplitude.js`)

| Field    | Value                              |
|----------|------------------------------------|
| API Key  | `0eb996afdc3cdbf6e657d52ff7db2251` |

Default tracking: sessions + page views enabled; form interactions + file downloads disabled.

**Tracked Events:**
- `tab_switched`, `topic_toggled`, `difficulty_changed`
- `word_translated`, `story_loaded`, `story_completed`
- `onboarding` steps
- `generate_story_clicked`, `paywall_opened`, `plan_selected`
- Subscription lifecycle: `view_paywall`, `purchase_started`, `purchase_completed`, `purchase_cancelled`, `purchase_failed`
- Restore lifecycle: `restore_started`, `restore_completed`, `restore_no_purchases`, `restore_failed`
- `notification_opened`, `story_audio_play`, `word_pronunciation`

### Google Analytics (`src/services/analytics.js`)

| Field          | Value                 |
|----------------|-----------------------|
| Measurement ID | `G-QN8W7KQK1Y`       |
| API Secret     | `WVAunVloQ5qFvBiJzB63QQ` |

Uses Measurement Protocol for server-side event tracking. Session timeout: 30 minutes. Client ID persisted in localStorage.

---

## 12. Backend API

### API Server

| Field    | Value                              |
|----------|------------------------------------|
| Base URL | `https://libro-ai.blackboxcode.io` |

### Endpoints

| Method | Endpoint                   | Purpose                              |
|--------|----------------------------|--------------------------------------|
| POST   | `/v1/users`                | Register user (device-based)         |
| POST   | `/v1/sessions`             | Login / token refresh                |
| POST   | `/v1/translate`            | Translate a word                     |
| POST   | `/v1/pronunciations`       | Get word pronunciation (audio blob)  |
| POST   | `/v1/stories`              | Generate a new story                 |
| GET    | `/v1/stories`              | List user's stories                  |
| GET    | `/v1/stories/:id`          | Get a specific story                 |
| GET    | `/v1/stories/:id/audio`    | Get story audio (async with polling) |
| GET    | `/v1/versions`             | Check current app version            |

### Authentication

Device-based auto-registration:
1. On first launch, get device ID via `@capacitor/device`
2. Auto-generate credentials from device ID
3. Register or login via API
4. JWT token stored in Pinia (persisted)
5. Axios interceptor attaches Bearer token to all requests
6. 401 responses trigger automatic token refresh

### Audio Processing

Story audio is processed asynchronously:
- `202` - Audio is being generated (poll again)
- `404` - Audio processing not started yet
- `200` - Audio ready (returns URL)
- `422` - Audio generation failed

---

## 13. Services Architecture

| Service           | File                          | Purpose                                  |
|-------------------|-------------------------------|------------------------------------------|
| Auth              | `src/services/auth.js`        | Device auth, token management            |
| HTTP              | `src/services/http.js`        | Axios instance with interceptors         |
| API               | `src/services/api.js`         | API endpoint methods                     |
| Translation       | `src/services/translation.js` | Word translation with caching            |
| Subscription      | `src/services/subscription.js`| RevenueCat purchase management           |
| Ads               | `src/services/ads.js`         | AdMob banner/interstitial/rewarded       |
| Notifications     | `src/services/notifications.js`| FCM push notifications                  |
| Amplitude         | `src/services/amplitude.js`   | User behavior analytics                 |
| Analytics (GA)    | `src/services/analytics.js`   | Google Analytics Measurement Protocol    |
| Platform          | `src/services/platform.js`    | Platform detection (iOS/Android/web)     |
| Review            | `src/services/review.js`      | In-app review prompting                 |
| Storage           | `src/services/storage.js`     | Unified storage (Preferences / localStorage) |

---

## 14. Build Scripts & Commands

### NPM Scripts

| Command                        | Purpose                          |
|--------------------------------|----------------------------------|
| `npm run dev`                  | Start dev server with `--host`   |
| `npm run build`                | Production build                 |
| `npm run preview`              | Preview production build         |
| `npm run build:ios`            | Build + sync for iOS             |
| `npm run build:android`        | Build + sync for Android         |
| `npm run build:android:release`| Release AAB for Google Play      |
| `npm run lint`                 | ESLint fix                       |

### iOS Build Script (`scripts/build/ios/start.sh`)

Flags: `-s` skip build, `-n` no Xcode open, `-d` run on device

Steps:
1. Clean build artifacts
2. Build Vue app (`npm run build`)
3. Sync Capacitor (`npx cap sync ios`)
4. Open Xcode or run on device

### Android Build Script (`scripts/build/android/start.sh`)

Flags: `-s` skip build, `-n` no open, `-d` device, `-b` bundle (release AAB)

Steps:
1. Clean build artifacts
2. Build Vue app
3. Sync Capacitor
4. Configure Java (downgrade to 17 if needed)
5. Inject AdMob App ID into AndroidManifest
6. Inject release signing config into build.gradle
7. Build debug APK or release AAB (with `-b`)

Version code auto-increments on release build. Current version code tracked in `scripts/build/android/version_code.txt`.

### Asset Generation

```bash
npx capacitor-assets generate --ios
npx capacitor-assets generate --android
```

---

## 15. Environment Variables

### `.env` File

```
VUE_APP_GA_API_SECRET=WVAunVloQ5qFvBiJzB63QQ
VUE_APP_GA_MEASUREMENT_ID=G-QN8W7KQK1Y
VITE_REVENUECAT_API_KEY_IOS=appl_AvEzTEtrHiwVSWEQKMKQbhKnytZ
VITE_REVENUECAT_API_KEY_ANDROID=goog_uHjlyAaZAUGRXESYeLTaczEcEYU
VITE_AMPLITUDE_API_KEY=0eb996afdc3cdbf6e657d52ff7db2251
VITE_PROD_IOS_LINK=https://apps.apple.com/us/app/libroai-learn-by-reading/id6758308600
VITE_API_BASE_URL="https://libro-ai.blackboxcode.io"
```

### Key IDs Reference

| ID                        | Value                                          |
|---------------------------|-------------------------------------------------|
| Apple Team ID             | `482YD3G9Z6`                                   |
| APNs Key ID               | `2R98A9U83S`                                   |
| Firebase Project ID       | `libro-ai-app`                                 |
| Firebase Sender ID        | `665249793440`                                 |
| App Store ID              | `6758308600`                                   |
| AdMob App ID              | `ca-app-pub-1402799140473121~3676694853`        |
| RevenueCat Entitlement    | `premium`                                      |
| Bundle ID (both platforms)| `com.libroai.app`                              |
