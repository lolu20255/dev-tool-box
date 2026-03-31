<template>
  <div :class="['h-screen overflow-hidden font-rajdhani', isDark ? 'theme-dark' : 'theme-light']">
    <!-- Animated background grid (dark only) -->
    <div v-if="isDark" class="fixed inset-0 bg-grid-cyan opacity-10 animate-pulse-slow"></div>

    <!-- Scanline effect (dark only) -->
    <div v-if="isDark" class="fixed inset-0 scanlines pointer-events-none"></div>

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
            <li v-for="tool in tools" :key="tool.id">
              <button
                @click="activeTool = tool.id"
                :class="[
                  'w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 group',
                  activeTool === tool.id
                    ? 'nav-active'
                    : 'nav-inactive'
                ]"
              >
                <span
                  :class="[
                    'w-8 h-8 rounded flex items-center justify-center text-lg',
                    activeTool === tool.id ? 'icon-active' : 'icon-inactive'
                  ]"
                  v-html="tool.icon"
                ></span>
                <div>
                  <div class="font-mono text-sm font-bold">{{ tool.name }}</div>
                  <div class="text-xs muted">{{ tool.description }}</div>
                </div>
              </button>
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
          <div class="px-8 py-6">
            <h2 class="text-4xl font-orbitron font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-pink-500 to-purple-600">
              {{ currentTool.title }}
            </h2>
            <p class="text-sm subtitle mt-2 font-mono">&gt; {{ currentTool.subtitle }}</p>
          </div>
        </header>

        <!-- Tool Content -->
        <main class="flex-1 overflow-y-auto p-8">
          <JsonDiff v-if="activeTool === 'json-diff'" />
          <TradingProfit v-else-if="activeTool === 'trading-profit'" />
          <MarkdownPreview v-else-if="activeTool === 'md-preview'" />
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
import { storeToRefs } from 'pinia'
import { useThemeStore } from './stores/theme'
import JsonDiff from './components/JsonDiff.vue'
import TradingProfit from './components/TradingProfit.vue'
import MarkdownPreview from './components/MarkdownPreview.vue'

const themeStore = useThemeStore()
const { isDark } = storeToRefs(themeStore)
const toggleTheme = themeStore.toggle

const activeTool = ref('json-diff')

const tools = [
  {
    id: 'json-diff',
    name: 'JSON DIFF',
    description: 'Compare JSON objects',
    title: 'JSON::DIFF',
    subtitle: 'PRODUCT DATA COMPARISON ENGINE',
    icon: '{ }'
  },
  {
    id: 'trading-profit',
    name: 'TRADING P&L',
    description: 'Calculate trading profit',
    title: 'TRADING::PROFIT',
    subtitle: 'PROFIT & LOSS CALCULATOR',
    icon: '$'
  },
  {
    id: 'md-preview',
    name: 'MD PREVIEW',
    description: 'Render markdown files',
    title: 'MD::PREVIEW',
    subtitle: 'MARKDOWN RENDER ENGINE',
    icon: '#'
  }
]

const currentTool = computed(() => {
  return tools.find(t => t.id === activeTool.value) || tools[0]
})
</script>

