<template>
  <div>
    <!-- SEO Content Section -->
    <section class="mb-8 text-center">
      <h2 class="text-2xl font-orbitron mb-3 section-title">App Launch Tracker</h2>
      <p class="muted max-w-3xl mx-auto mb-4">
        Track every step required to deploy your mobile app to production on both the
        <strong class="subtitle">App Store</strong> and <strong class="subtitle">Google Play</strong>.
      </p>
    </section>

    <!-- Not logged in -->
    <div v-if="!user" class="cyber-panel p-12 text-center">
      <div class="text-5xl mb-4 opacity-60">&#128274;</div>
      <p class="text-lg mb-2">LOGIN REQUIRED</p>
      <p class="muted text-sm">Sign in to create and track your app deployments.</p>
    </div>

    <!-- Logged in -->
    <template v-else>
      <!-- App Selector + Create -->
      <div class="cyber-panel mb-6">
        <div class="cyber-panel-header">
          <span class="panel-label-primary font-mono">&gt; MY APPS</span>
          <div class="flex items-center gap-3">
            <button @click="showCreateModal = true" class="cyber-button text-xs px-3 py-1">+ NEW APP</button>
            <div class="h-2 w-2 dot-primary rounded-full animate-pulse"></div>
          </div>
        </div>
        <div class="p-4">
          <div v-if="!apps.length" class="text-center py-8">
            <p class="muted text-sm font-mono">No apps yet. Create your first app to start tracking.</p>
          </div>
          <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <button v-for="app in apps" :key="app.id" @click="selectApp(app)" :class="[
              'text-left p-4 rounded-lg border-2 transition-all duration-500',
              getAppProgress(app) >= 100
                ? 'app-card-complete'
                : selectedApp?.id === app.id
                  ? 'border-cyan-500 bg-cyan-500/10'
                  : 'border-transparent hover:border-cyan-500/30 bg-white/5'
            ]">
              <div class="flex items-center justify-between mb-2">
                <span
                  :class="['font-mono text-sm font-bold truncate', getAppProgress(app) >= 100 ? 'text-green-300' : '']">
                  {{ getAppProgress(app) >= 100 ? '&#10004; ' : '' }}{{ app.name }}
                </span>
                <button @click.stop="confirmDeleteApp(app)"
                  class="text-xs opacity-40 hover:opacity-100 hover:text-red-400 transition-all ml-2 shrink-0"
                  title="Delete app">&#10005;</button>
              </div>
              <div v-if="app.bundleId"
                :class="['text-xs font-mono mb-2', getAppProgress(app) >= 100 ? 'text-green-500/70' : 'muted']">{{
                  app.bundleId }}</div>
              <input v-else @click.stop @keyup.enter="saveBundleId(app, $event)" @blur="saveBundleId(app, $event)"
                type="text" placeholder="Add bundle ID..."
                class="text-xs font-mono mb-2 muted bg-transparent border-b border-dashed border-white/20 focus:border-cyan-500 outline-none w-full py-0.5 transition-colors" />
              <div class="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                <div class="h-full rounded-full transition-all duration-500"
                  :class="getProgressColor(getAppProgress(app))" :style="{ width: getAppProgress(app) + '%' }"></div>
              </div>
              <div
                :class="['text-xs mt-1 font-mono text-right', getAppProgress(app) >= 100 ? 'text-green-400' : 'muted']">
                {{ getAppProgress(app) }}%</div>
            </button>
          </div>
        </div>
      </div>

      <!-- Checklist for selected app -->
      <template v-if="selectedApp">
        <!-- Progress Overview -->
        <div :class="['cyber-panel mb-6 transition-all duration-500', totalProgress >= 100 ? 'category-complete' : '']">
          <div class="cyber-panel-header">
            <span :class="['font-mono', totalProgress >= 100 ? 'text-green-400' : 'panel-label-secondary']">&gt; {{
              selectedApp.name }} :: PROGRESS</span>
            <div
              :class="['h-2 w-2 rounded-full', totalProgress >= 100 ? 'bg-green-500 animate-pulse' : 'dot-secondary animate-pulse']">
            </div>
          </div>
          <div class="p-6">
            <!-- Big percentage / status -->
            <div class="flex items-end justify-between mb-4">
              <div>
                <div class="font-mono text-4xl font-black tracking-tight" :class="getProgressTextColor(totalProgress)">
                  {{ totalProgress >= 100 ? 'DEPLOYED' : totalProgress + '%' }}
                </div>
                <div class="text-xs font-mono muted mt-1">
                  {{ totalProgress >= 100 ? 'All systems go — app is live in production' : 'Progress towards production deployment' }}
                </div>
              </div>
              <div class="text-right">
                <div class="font-mono text-2xl font-bold" :class="getProgressTextColor(totalProgress)">
                  {{ completedCount }}<span class="text-sm muted">/{{ totalCount }}</span>
                </div>
                <div class="text-xs font-mono muted">tasks done</div>
              </div>
            </div>

            <!-- Progress bar -->
            <div class="w-full bg-white/10 rounded-full h-3 overflow-hidden mb-4">
              <div class="h-full rounded-full transition-all duration-700 progress-bar-glow"
                :class="getProgressColor(totalProgress)" :style="{ width: totalProgress + '%' }"></div>
            </div>

            <!-- Category mini-stats -->
            <div class="grid grid-cols-5 gap-2">
              <div v-for="category in categories" :key="category.id" class="text-center">
                <div class="text-xs font-mono mb-1 truncate"
                  :class="getCategoryProgress(category) >= 100 ? 'text-green-400' : 'muted'" :title="category.name"
                  v-html="getCategoryProgress(category) >= 100 ? '&#10004;' : getCategoryCompleted(category) + '/' + category.items.length">
                </div>
                <div class="w-full bg-white/10 rounded-full h-1 overflow-hidden">
                  <div class="h-full rounded-full transition-all duration-500"
                    :class="getProgressColor(getCategoryProgress(category))"
                    :style="{ width: getCategoryProgress(category) + '%' }"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Categories -->
        <div class="space-y-4">
          <div v-for="category in categories" :key="category.id" :class="[
            'cyber-panel transition-all duration-500',
            getCategoryProgress(category) >= 100 ? 'category-complete' : getCategoryProgress(category) >= 40 ? 'category-warning' : ''
          ]">
            <button @click="toggleCategory(category.id)" :class="[
              'cyber-panel-header w-full cursor-pointer transition-colors',
              getCategoryProgress(category) >= 100 ? 'hover:bg-green-500/10' : getCategoryProgress(category) >= 40 ? 'hover:bg-yellow-500/10' : 'hover:bg-white/5'
            ]">
              <div class="flex items-center gap-3">
                <span class="text-lg" v-html="getCategoryProgress(category) >= 100 ? '&#10004;' : category.icon"></span>
                <span
                  :class="['font-mono', getCategoryProgress(category) >= 100 ? 'text-green-400' : getCategoryProgress(category) >= 40 ? 'text-yellow-400' : 'panel-label-primary']">&gt;
                  {{ category.name }}</span>
                <span
                  :class="['text-xs font-mono', getCategoryProgress(category) >= 100 ? 'text-green-500/70' : getCategoryProgress(category) >= 40 ? 'text-yellow-500/70' : 'muted']">
                  ({{ getCategoryCompleted(category) }}/{{ category.items.length }})
                </span>
              </div>
              <div class="flex items-center gap-3">
                <div class="w-24 bg-white/10 rounded-full h-1.5 overflow-hidden">
                  <div class="h-full rounded-full transition-all duration-500"
                    :class="getProgressColor(getCategoryProgress(category))"
                    :style="{ width: getCategoryProgress(category) + '%' }"></div>
                </div>
                <span
                  :class="['text-xs font-mono transition-transform duration-200', expandedCategories.has(category.id) ? 'rotate-180' : '', getCategoryProgress(category) >= 100 ? 'text-green-500' : getCategoryProgress(category) >= 40 ? 'text-yellow-500' : '']">
                  &#9660;
                </span>
              </div>
            </button>

            <Transition name="expand">
              <div v-if="expandedCategories.has(category.id)" class="p-4 space-y-2">
                <label v-for="item in category.items" :key="item.id"
                  class="flex items-start gap-3 p-3 rounded-lg hover:bg-white/5 cursor-pointer transition-colors group">
                  <input type="checkbox" :checked="isChecked(category.id, item.id)"
                    @change="toggleItem(category.id, item.id)" class="mt-0.5 w-4 h-4 accent-cyan-500 shrink-0" />
                  <div class="flex-1 min-w-0">
                    <div class="text-sm font-mono"
                      :class="isChecked(category.id, item.id) ? 'line-through opacity-50' : ''">
                      {{ item.label }}
                    </div>
                    <div v-if="item.hint" class="text-xs muted mt-0.5 whitespace-pre-line">{{ item.hint }}</div>
                  </div>
                </label>
              </div>
            </Transition>
          </div>
        </div>
      </template>
    </template>

    <!-- Create App Modal -->
    <Transition name="modal">
      <div v-if="showCreateModal" class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click.self="showCreateModal = false">
        <div class="fixed inset-0 bg-black/60 backdrop-blur-sm"></div>
        <div class="cyber-modal relative z-10 w-full max-w-md p-6">
          <h3
            class="text-lg font-orbitron font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-pink-500 to-purple-600 mb-4">
            NEW::APP
          </h3>
          <label class="block text-xs font-mono panel-label-primary mb-1">APP NAME</label>
          <input v-model="newApp.name" type="text" placeholder="My Awesome App" class="cyber-input rounded-lg mb-3"
            @keyup.enter="createApp" />
          <label class="block text-xs font-mono panel-label-primary mb-1">BUNDLE ID</label>
          <input v-model="newApp.bundleId" type="text" placeholder="com.company.appname"
            class="cyber-input rounded-lg mb-3" />
          <label class="block text-xs font-mono panel-label-primary mb-1">PLATFORM</label>
          <select v-model="newApp.platform" class="cyber-input rounded-lg mb-4">
            <option value="both">iOS + Android</option>
            <option value="ios">iOS Only</option>
            <option value="android">Android Only</option>
          </select>
          <div class="flex justify-end gap-3">
            <button @click="showCreateModal = false" class="cyber-button-secondary text-xs px-4 py-2">CANCEL</button>
            <button @click="createApp" :disabled="!newApp.name.trim() || creating"
              class="cyber-button text-xs px-4 py-2">
              {{ creating ? 'CREATING...' : 'CREATE' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Delete Confirmation Modal -->
    <Transition name="modal">
      <div v-if="appToDelete" class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click.self="appToDelete = null">
        <div class="fixed inset-0 bg-black/60 backdrop-blur-sm"></div>
        <div class="cyber-modal relative z-10 w-full max-w-sm p-6">
          <h3 class="text-lg font-orbitron font-bold text-red-400 mb-4">DELETE::APP</h3>
          <p class="text-sm mb-4">
            Are you sure you want to delete <strong class="subtitle">{{ appToDelete.name }}</strong>?
            All progress will be lost.
          </p>
          <div class="flex justify-end gap-3">
            <button @click="appToDelete = null" class="cyber-button-secondary text-xs px-4 py-2">CANCEL</button>
            <button @click="deleteApp" :disabled="deleting"
              class="cyber-button text-xs px-4 py-2 !bg-red-600 hover:!bg-red-500">
              {{ deleting ? 'DELETING...' : 'DELETE' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, watch, reactive } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '../stores/auth'
import { useToast } from '../composables/useToast'
import { db } from '../firebase'
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  serverTimestamp
} from 'firebase/firestore'

const authStore = useAuthStore()
const { user } = storeToRefs(authStore)
const toast = useToast()

const apps = ref([])
const selectedApp = ref(null)
const showCreateModal = ref(false)
const creating = ref(false)
const deleting = ref(false)
const appToDelete = ref(null)
const expandedCategories = reactive(new Set())

const newApp = reactive({
  name: '',
  bundleId: '',
  platform: 'both'
})

// -- Checklist Definition (derived from the App Setup Guide) --

const categories = [
  {
    id: 'app-branding',
    name: 'APP BRANDING',
    icon: '&#128204;',
    items: [
      { id: 'app-name', label: 'Find app name', hint: 'App name' },
      { id: 'app-icon', label: 'Design app icon', hint: 'App icon' },
      { id: 'app-splash', label: 'Design app splash screen in Figma template', hint: 'App Icon, Splash Screen, InfoGraphic, etc' },
      { id: 'app-keywords', label: 'Find best keywords for store listing using Astro', hint: 'Research top keywords, competitor analysis, optimize title & subtitle for ASO' },
    ]
  },
  {
    id: 'project-foundation',
    name: 'FRONTEND APP',
    icon: '&#9881;',
    items: [
      { id: 'scaffold', label: 'Github repo init, remote configuration & initial commit', hint: 'git init, .gitignore, create remote repo, git remote add origin, first push' },
      { id: 'frontend-ui', label: 'Set up frontend framework, UI library & state management', hint: 'Vue/React/ReactNative/Expo, Vuetify/Tailwind, Pinia/Redux with persistence, HTTP client' },
      { id: 'design-system', label: 'Define design system (theme, typography, icons)', hint: 'Color palette, dark/light mode, Google Fonts, icon set (MDI, Heroicons)' },
      { id: 'routing-nav', label: 'Configure routing & navigation', hint: 'Router with hash history, route meta' },
      { id: 'capacitor-bridge', label: 'Initialize Capacitor/Expo & Add platforms', hint: 'npx cap init, add iOS + Android, install plugins (Device, Push, Splash, Haptics)' },
    ]
  },
  {
    id: 'backend-api',
    name: 'BACKEND API',
    icon: '&#9889;',
    items: [
      { id: 'api-server', label: 'Define and set up API service', hint: 'Node, Rails, Firebase, Supabase, etc.' },
      { id: 'api-endpoints', label: 'Implement API endpoints into app', hint: 'CRUD, auth, business logic' },
      { id: 'api-auth', label: 'Implement authentication flow', hint: 'Device-based, email/pass, OAuth, JWT' },
      { id: 'api-deploy', label: 'Deploy backend to production', hint: 'Cloud hosting, SSL, domain' },
    ]
  },
  {
    id: 'ios-setup',
    name: 'iOS SETUP & APP STORE',
    icon: '&#63743;',
    items: [
      { id: 'ios-bundle-id', label: 'Set Bundle ID in Xcode', hint: 'com.company.appname' },
      { id: 'ios-dev-team', label: 'Configure Development Team & signing', hint: 'Apple Developer account, Team ID' },
      { id: 'ios-build-test', label: 'Build and test on simulator / device', hint: 'npm run build:ios, open Xcode workspace' },
      { id: 'ios-archive', label: 'Archive and upload to App Store Connect', hint: 'Product > Archive > Distribute' },
      { id: 'ios-app-store', label: 'Create App Store listing (screenshots, description)', hint: 'App Store Connect metadata' },
      { id: 'ios-review-submit', label: 'Submit for App Review', hint: 'Review guidelines compliance' },
    ]
  },
  {
    id: 'android-setup',
    name: 'ANDROID SETUP & GOOGLE PLAY',
    icon: '&#129302;',
    items: [
      { id: 'android-package', label: 'Set applicationId / package name', hint: 'build.gradle namespace' },
      { id: 'android-keystore', label: 'Create release keystore for signing', hint: 'keytool -genkey, store securely' },
      { id: 'android-icons', label: 'Generate Android app icons & feature-graphic', hint: 'Adaptive icons, all densities, 1024x500 feature graphic' },
      { id: 'android-build-test', label: 'Build and test on emulator / device', hint: 'npm run build:android' },
      { id: 'android-aab', label: 'Build release AAB for Play Store', hint: 'bundleRelease, outputs/bundle/release/' },
      { id: 'android-play-listing', label: 'Create Google Play listing', hint: 'Screenshots, description, content rating' },
      { id: 'android-play-submit', label: 'Submit to Google Play review', hint: 'Production track or internal testing first' },
    ]
  },
  {
    id: 'firebase-push',
    name: 'FIREBASE & PUSH NOTIFICATIONS',
    icon: '&#128293;',
    items: [
      { id: 'firebase-project', label: 'Create Firebase project', hint: 'Firebase Console, project settings' },
      { id: 'firebase-ios-config', label: 'Download & add GoogleService-Info.plist (iOS)', hint: 'ios/App/App/GoogleService-Info.plist' },
      { id: 'firebase-android-config', label: 'Download & add google-services.json (Android)', hint: 'android/app/google-services.json' },
      { id: 'apns-key', label: 'Create & upload APNs key for iOS push', hint: '.p8 file, Key ID, Team ID in Firebase Console' },
      { id: 'push-service', label: 'Implement push notification service', hint: 'Registration, topic subscription, deep linking' },
      { id: 'push-appdelegate', label: 'Configure AppDelegate for push (iOS)', hint: 'Delegate methods, APNs token forwarding' },
      { id: 'push-test', label: 'Test push notifications on both platforms', hint: 'Firebase Console test message' },
    ]
  },
  {
    id: 'subscriptions-ios',
    name: 'IN-APP SUBSCRIPTIONS iOS',
    icon: '&#128176;',
    items: [
      { id: 'revenuecat-project', label: 'Create RevenueCat project', hint: 'Or your preferred IAP provider' },
      { id: 'revenuecat-ios-1', label: 'Configure iOS app in RevenueCat', hint: 'App Store Connect API key, shared secret' },
      { id: 'revenuecat-ios-2', label: 'Get the .p8 file from apple and upload it to RevenueCat', hint: '1. Go to App Store Connect\n2. Click Users and Access (top nav)\n3. Go to the Integrations tab → App Store Connect API\n4. Click the + button to generate a new key\n5. Give it a name (e.g. "RevenueCat")\n6. Select Admin access role (RevenueCat needs this)\n7. Click Generate\n8. Download the .p8 file — you can only download it once, so save it somewhere safe\n\nYou\'ll also need these two values when uploading to RevenueCat:\n- Issuer ID — shown at the top of the API keys page\n- Key ID — shown next to your generated key' },
      { id: 'revenuecat-ios-3', label: 'Get iOS project api and add it to the .env file', hint: 'VITE_REVENUECAT_API_KEY_IOS' },
      { id: 'iap-products-1', label: 'Create subscription products in App Store Connect', hint: 'Weekly, Monthly, Annual in App Store Connect' },
      { id: 'iap-products-3', label: 'Add two week free trial to the subscription products', hint: 'Add two week free trial to the subscription products' },
      { id: 'iap-products-2', label: 'Create Paywall and test in sandbox mode', hint: 'Build in testflight and test the paywall' },
    ]
  },
  {
    id: 'subscriptions-android',
    name: 'IN-APP SUBSCRIPTIONS ANDROID',
    icon: '&#128176;',
    items: [
      { id: 'revenuecat-project', label: 'Create RevenueCat project', hint: 'Or your preferred IAP provider' },
      { id: 'revenuecat-android-1', label: 'Configure Android app in RevenueCat', hint: 'Google Play API key, shared secret' },
      { id: 'revenuecat-android-2', label: 'Create service account in https://console.cloud.google.com. Enable Billing and Google Play Developer API.', hint: 'Invite the service account to your app in Google Play Console' },
      { id: 'revenuecat-android-3', label: 'Get the JSON file from Google Cloud Console and upload it to RevenueCat', hint: ' 1. Go to Google Cloud Console → console.cloud.google.com \n 2. Select the proje ct linked to your Google Play Developer account \n 3. Go to IAM & Admin → Service Accounts  \n 4. Either use an existing service account or create a new one \n 5. Click on the service account → Keys tab → Add Key → Create new key → JSON \n 6. It will download a .json file — that\'s what you upload to RevenueCat ' },
      { id: 'revenuecat-android-4', label: 'Get Android project api and add it to the .env file', hint: 'VITE_REVENUECAT_API_KEY_ANDROID' },
      { id: 'iap-products-1', label: 'Create subscription products in Google Play Console', hint: 'Weekly, Monthly, Annual in Google Play Console' },
      { id: 'iap-products-2', label: 'Add two week free trial to the subscription products', hint: 'Add two week free trial to the subscription products' },
      { id: 'iap-products-3', label: 'Create Paywall and test in sandbox mode', hint: 'Build in testflight and test the paywall' },
    ]
  },
  {
    id: 'advertising',
    name: 'ADMOB ADVERTISING',
    icon: '&#128184;',
    items: [
      { id: 'admob-account', label: 'Set up AdMob account & app', hint: 'admob.google.com' },
      { id: 'admob-units', label: 'Create ad units (banner, interstitial, rewarded)', hint: 'Note ad unit IDs' },
      { id: 'ad-service', label: 'Implement ad service in app', hint: 'Banner, interstitial, rewarded ad logic' },
      { id: 'ad-premium-hide', label: 'Hide ads for premium users', hint: 'Check subscription status before showing' },
      { id: 'att-ios', label: 'Implement ATT prompt on iOS', hint: 'Request tracking before ad init' },
    ]
  },
  {
    id: 'analytics',
    name: 'TRACKING & ANALYTICS',
    icon: '&#128200;',
    items: [
      { id: 'amplitude', label: 'Implement Amplitude analytics', hint: 'API key, session/page tracking, custom events (tabs, purchases, stories)' },
      { id: 'google-analytics', label: 'Implement Google Analytics', hint: 'Measurement ID, API secret, Measurement Protocol for server-side events' },
    ]
  },
  {
    id: 'build-scripts',
    name: 'BUILD SCRIPTS & CI/CD',
    icon: '&#128295;',
    items: [
      { id: 'scripts-ios', label: 'Create iOS build script', hint: 'Clean, build Vue, sync Capacitor, open Xcode' },
      { id: 'scripts-android', label: 'Create Android build script', hint: 'Clean, build, sync, signing injection, AAB output' },
      { id: 'scripts-assets', label: 'Create asset generation command', hint: 'npx capacitor-assets generate' },
      { id: 'scripts-version', label: 'Create version code auto-increment', hint: 'Track version code in file, bump on release' },
    ]
  },
  {
    id: 'environment',
    name: 'ENVIRONMENT & SECRETS',
    icon: '&#128272;',
    items: [
      { id: 'env-file', label: 'Create .env file with all variables', hint: 'API keys, base URLs, feature flags' },
      { id: 'env-gitignore', label: 'Ensure .env is in .gitignore', hint: 'Never commit secrets' },
    ]
  }
]

// -- Firestore --

watch(user, (u) => {
  if (u) {
    fetchApps()
  } else {
    apps.value = []
    selectedApp.value = null
  }
}, { immediate: true })

async function fetchApps() {
  if (!user.value) return
  const q = query(
    collection(db, 'users', user.value.uid, 'apps'),
    orderBy('createdAt', 'desc')
  )
  const snapshot = await getDocs(q)
  apps.value = snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
  if (selectedApp.value) {
    const updated = apps.value.find(a => a.id === selectedApp.value.id)
    if (updated) selectedApp.value = updated
    else selectedApp.value = null
  }
}

async function createApp() {
  if (!newApp.name.trim() || !user.value) return
  creating.value = true
  try {
    const docRef = await addDoc(collection(db, 'users', user.value.uid, 'apps'), {
      name: newApp.name.trim(),
      bundleId: newApp.bundleId.trim(),
      platform: newApp.platform,
      checklist: {},
      createdAt: serverTimestamp()
    })
    showCreateModal.value = false
    newApp.name = ''
    newApp.bundleId = ''
    newApp.platform = 'both'
    toast.success(`"${newApp.name || 'App'}" created`)
    await fetchApps()
    const created = apps.value.find(a => a.id === docRef.id)
    if (created) selectApp(created)
  } catch {
    toast.error('Failed to create app. Please try again.')
  } finally {
    creating.value = false
  }
}

function confirmDeleteApp(app) {
  appToDelete.value = app
}

async function deleteApp() {
  if (!appToDelete.value || !user.value) return
  deleting.value = true
  try {
    await deleteDoc(doc(db, 'users', user.value.uid, 'apps', appToDelete.value.id))
    if (selectedApp.value?.id === appToDelete.value.id) selectedApp.value = null
    toast.success(`"${appToDelete.value.name}" deleted`)
    appToDelete.value = null
    await fetchApps()
  } catch {
    toast.error('Failed to delete app.')
  } finally {
    deleting.value = false
  }
}

function selectApp(app) {
  selectedApp.value = app
}

async function saveBundleId(app, event) {
  const value = event.target.value.trim()
  if (!value || !user.value) return
  try {
    await updateDoc(doc(db, 'users', user.value.uid, 'apps', app.id), { bundleId: value })
    app.bundleId = value
    toast.success(`Bundle ID set to "${value}"`)
  } catch {
    toast.error('Failed to save bundle ID.')
  }
}

function isChecked(categoryId, itemId) {
  return selectedApp.value?.checklist?.[`${categoryId}__${itemId}`] === true
}

async function toggleItem(categoryId, itemId) {
  if (!selectedApp.value || !user.value) return
  const key = `${categoryId}__${itemId}`
  const newVal = !isChecked(categoryId, itemId)

  // Optimistic update
  if (!selectedApp.value.checklist) selectedApp.value.checklist = {}
  selectedApp.value.checklist[key] = newVal

  try {
    await updateDoc(doc(db, 'users', user.value.uid, 'apps', selectedApp.value.id), {
      [`checklist.${key}`]: newVal
    })
  } catch {
    selectedApp.value.checklist[key] = !newVal
    toast.error('Failed to save. Please try again.')
  }
}

function toggleCategory(categoryId) {
  if (expandedCategories.has(categoryId)) {
    expandedCategories.delete(categoryId)
  } else {
    expandedCategories.add(categoryId)
  }
}

// -- Progress --

const totalCount = computed(() => categories.reduce((sum, c) => sum + c.items.length, 0))

const completedCount = computed(() => {
  if (!selectedApp.value?.checklist) return 0
  return Object.values(selectedApp.value.checklist).filter(Boolean).length
})

const totalProgress = computed(() => {
  if (!totalCount.value) return 0
  return Math.round((completedCount.value / totalCount.value) * 100)
})

function getAppProgress(app) {
  if (!app.checklist) return 0
  const checked = Object.values(app.checklist).filter(Boolean).length
  return Math.round((checked / totalCount.value) * 100)
}

function getCategoryCompleted(category) {
  if (!selectedApp.value?.checklist) return 0
  return category.items.filter(item =>
    selectedApp.value.checklist[`${category.id}__${item.id}`] === true
  ).length
}

function getCategoryProgress(category) {
  const completed = getCategoryCompleted(category)
  return Math.round((completed / category.items.length) * 100)
}

function getProgressColor(pct) {
  if (pct >= 100) return 'bg-green-500'
  if (pct >= 70) return 'bg-cyan-500'
  if (pct >= 40) return 'bg-yellow-500'
  return 'bg-pink-500'
}

function getProgressTextColor(pct) {
  if (pct >= 100) return 'text-green-400'
  if (pct >= 70) return 'text-cyan-400'
  if (pct >= 40) return 'text-yellow-400'
  return 'text-pink-400'
}
</script>

<style scoped>
.progress-bar-glow {
  box-shadow: 0 0 8px currentColor;
}

.app-card-complete {
  border-color: #22c55e !important;
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.12) 0%, rgba(34, 197, 94, 0.04) 100%) !important;
  box-shadow: 0 0 14px rgba(34, 197, 94, 0.25), 0 0 4px rgba(34, 197, 94, 0.4), inset 0 0 16px rgba(34, 197, 94, 0.04);
}

.category-warning {
  border-color: #eab308 !important;
  background: linear-gradient(135deg, rgba(234, 179, 8, 0.08) 0%, rgba(234, 179, 8, 0.03) 100%) !important;
  box-shadow: 0 0 12px rgba(234, 179, 8, 0.2), 0 0 4px rgba(234, 179, 8, 0.3), inset 0 0 16px rgba(234, 179, 8, 0.03);
}

.category-warning .cyber-panel-header {
  border-bottom-color: rgba(234, 179, 8, 0.2) !important;
}

.category-complete {
  border-color: #22c55e !important;
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.08) 0%, rgba(34, 197, 94, 0.03) 100%) !important;
  box-shadow: 0 0 16px rgba(34, 197, 94, 0.25), 0 0 4px rgba(34, 197, 94, 0.4), inset 0 0 20px rgba(34, 197, 94, 0.04);
}

.category-complete .cyber-panel-header {
  border-bottom-color: rgba(34, 197, 94, 0.2) !important;
}

.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
  padding-top: 0;
  padding-bottom: 0;
}

.expand-enter-to,
.expand-leave-from {
  opacity: 1;
  max-height: 2000px;
}
</style>
