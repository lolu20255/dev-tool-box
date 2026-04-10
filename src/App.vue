<template>
  <div :class="['h-screen overflow-hidden font-rajdhani', isDark ? 'theme-dark' : 'theme-light']">
    <!-- Animated background grid (dark only) -->
    <div v-if="isDark" class="fixed inset-0 bg-grid-cyan opacity-10 animate-pulse-slow"></div>

    <!-- Scanline effect (dark only) -->
    <div v-if="isDark" class="fixed inset-0 scanlines pointer-events-none"></div>

    <!-- Toast notifications -->
    <ToastContainer />

    <div class="relative z-10 flex h-screen overflow-hidden">
      <!-- Left Sidebar -->
      <aside class="w-64 shrink-0 sidebar backdrop-blur-sm border-r-2 flex flex-col h-screen">
        <!-- Logo -->
        <div class="p-4 border-b-2 border-accent">
          <h1 class="text-2xl font-orbitron font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-pink-500 to-purple-600 animate-glow">
            DEV::TOOLBOX
          </h1>
          <p class="text-xs subtitle mt-1 font-mono">&gt; UTILITY SUITE v1.0</p>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 p-4">
          <div class="text-xs muted font-mono mb-3">&gt; SELECT TOOL</div>
          <ul class="space-y-2">
            <li v-for="tool in visibleTools" :key="tool.id">
              <router-link
                :to="'/' + tool.id"
                :class="[
                  'w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 group no-underline',
                  $route.name === tool.id
                    ? 'nav-active'
                    : 'nav-inactive'
                ]"
              >
                <span
                  :class="[
                    'w-8 h-8 rounded flex items-center justify-center text-lg',
                    $route.name === tool.id ? 'icon-active' : 'icon-inactive'
                  ]"
                  v-html="tool.icon"
                ></span>
                <div>
                  <div class="font-mono text-sm font-bold">{{ tool.name }}</div>
                  <div class="text-xs muted">{{ tool.description }}</div>
                </div>
              </router-link>
            </li>
          </ul>
        </nav>

        <!-- Theme Toggle -->
        <div class="p-4 border-t-2 border-accent">
          <button
            @click="toggleTheme"
            class="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 nav-inactive group"
          >
            <span class="w-8 h-8 rounded flex items-center justify-center text-lg icon-inactive">
              {{ isDark ? '&#9788;' : '&#9790;' }}
            </span>
            <div>
              <div class="font-mono text-sm font-bold">{{ isDark ? 'LIGHT MODE' : 'DARK MODE' }}</div>
              <div class="text-xs muted">Toggle theme</div>
            </div>
          </button>
        </div>

        <!-- Footer -->
        <div class="p-4 border-t-2 border-accent">
          <div class="text-xs muted font-mono">
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              SYSTEM ONLINE
            </div>
          </div>
        </div>
      </aside>

      <!-- Main Content -->
      <div class="flex-1 flex flex-col h-screen overflow-hidden">
        <!-- Header -->
        <header class="border-b-2 border-accent content-header backdrop-blur-sm">
          <div class="px-8 py-6 flex items-start justify-between">
            <div>
              <h2 class="text-4xl font-orbitron font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-pink-500 to-purple-600">
                {{ currentTool.title }}
              </h2>
              <p class="text-sm subtitle mt-2 font-mono">&gt; {{ currentTool.subtitle }}</p>
            </div>
            <div class="flex items-center gap-3 mt-1">
              <UserMenu v-if="authStore.user" @show-profile="showProfile = true" />
              <button
                v-else
                @click="showAuth = true"
                class="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 nav-inactive hover:border-cyan-500 font-mono text-sm"
              >
                <span class="text-base">&#9879;</span>
                LOGIN
              </button>
            </div>
          </div>
        </header>

        <!-- Auth Modal -->
        <AuthModal :show="showAuth" @close="showAuth = false" />

        <!-- Profile Modal -->
        <ProfileModal :show="showProfile" @close="showProfile = false" />

        <!-- Tool Content -->
        <main class="flex-1 overflow-y-auto p-8">
          <router-view />
        </main>

        <!-- Footer -->
        <footer class="border-t-2 border-accent content-header py-4">
          <div class="px-8 text-center muted text-sm">
            <p>Developer Tools Suite - Free online utilities for developers and traders</p>
          </div>
        </footer>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useThemeStore } from './stores/theme'
import { useAuthStore } from './stores/auth'
import { ALLOWED_EMAIL } from './router'
import AuthModal from './components/AuthModal.vue'
import ProfileModal from './components/ProfileModal.vue'
import UserMenu from './components/UserMenu.vue'
import ToastContainer from './components/ToastContainer.vue'

const route = useRoute()

const themeStore = useThemeStore()
const { isDark } = storeToRefs(themeStore)
const toggleTheme = themeStore.toggle

const authStore = useAuthStore()
authStore.init()

const showAuth = ref(false)
const showProfile = ref(false)

const tools = [
  {
    id: 'json-diff',
    name: 'JSON DIFF',
    description: 'Compare JSON objects',
    title: 'JSON::DIFF',
    subtitle: 'PRODUCT DATA COMPARISON ENGINE',
    icon: '{ }',
  },
  {
    id: 'trading-profit',
    name: 'TRADING P&L',
    description: 'Calculate trading profit',
    title: 'TRADING::PROFIT',
    subtitle: 'PROFIT & LOSS CALCULATOR',
    icon: '$',
    allowedEmail: ALLOWED_EMAIL,
  },
  {
    id: 'md-preview',
    name: 'MD PREVIEW',
    description: 'Render markdown files',
    title: 'MD::PREVIEW',
    subtitle: 'MARKDOWN RENDER ENGINE',
    icon: '#',
  },
  {
    id: 'app-checkmarks',
    name: 'APP CHECKLIST',
    description: 'Mobile app checklist',
    title: 'MOBILE::CHECKLIST',
    subtitle: 'MOBILE APP DEPLOYMENT TRACKER',
    icon: '&#10003;',
  }
]

const visibleTools = computed(() => {
  return tools.filter(t => !t.allowedEmail || authStore.user?.email === t.allowedEmail)
})

const currentTool = computed(() => {
  return tools.find(t => t.id === route.name) || tools[0]
})
</script>

