<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-cyan-400 font-rajdhani">
    <!-- Animated background grid -->
    <div class="fixed inset-0 bg-grid-cyan opacity-10 animate-pulse-slow"></div>

    <!-- Scanline effect -->
    <div class="fixed inset-0 scanlines pointer-events-none"></div>

    <div class="relative z-10 flex min-h-screen">
      <!-- Left Sidebar -->
      <aside class="w-64 bg-black bg-opacity-80 backdrop-blur-sm border-r-2 border-cyan-500 flex flex-col">
        <!-- Logo -->
        <div class="p-4 border-b-2 border-cyan-500">
          <h1 class="text-2xl font-orbitron font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-pink-500 to-purple-600 animate-glow">
            DEV::TOOLBOX
          </h1>
          <p class="text-xs text-pink-400 mt-1 font-mono">&gt; UTILITY SUITE v1.0</p>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 p-4">
          <div class="text-xs text-gray-500 font-mono mb-3">&gt; SELECT TOOL</div>
          <ul class="space-y-2">
            <li v-for="tool in tools" :key="tool.id">
              <button
                @click="activeTool = tool.id"
                :class="[
                  'w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 group',
                  activeTool === tool.id
                    ? 'bg-gradient-to-r from-cyan-900 to-purple-900 border-2 border-cyan-500 text-cyan-300'
                    : 'hover:bg-gray-900 border-2 border-transparent hover:border-gray-700 text-gray-400 hover:text-cyan-400'
                ]"
              >
                <span
                  :class="[
                    'w-8 h-8 rounded flex items-center justify-center text-lg',
                    activeTool === tool.id ? 'bg-cyan-500 text-black' : 'bg-gray-800 group-hover:bg-gray-700'
                  ]"
                  v-html="tool.icon"
                ></span>
                <div>
                  <div class="font-mono text-sm font-bold">{{ tool.name }}</div>
                  <div class="text-xs text-gray-500">{{ tool.description }}</div>
                </div>
              </button>
            </li>
          </ul>
        </nav>

        <!-- Footer -->
        <div class="p-4 border-t-2 border-cyan-500">
          <div class="text-xs text-gray-600 font-mono">
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              SYSTEM ONLINE
            </div>
          </div>
        </div>
      </aside>

      <!-- Main Content -->
      <div class="flex-1 flex flex-col">
        <!-- Header -->
        <header class="border-b-2 border-cyan-500 bg-black bg-opacity-80 backdrop-blur-sm">
          <div class="px-8 py-6">
            <h2 class="text-4xl font-orbitron font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-pink-500 to-purple-600">
              {{ currentTool.title }}
            </h2>
            <p class="text-sm text-pink-400 mt-2 font-mono">&gt; {{ currentTool.subtitle }}</p>
          </div>
        </header>

        <!-- Tool Content -->
        <main class="flex-1 overflow-y-auto p-8">
          <JsonDiff v-if="activeTool === 'json-diff'" />
          <TradingProfit v-else-if="activeTool === 'trading-profit'" />
        </main>

        <!-- Footer -->
        <footer class="border-t-2 border-cyan-500 bg-black bg-opacity-80 py-4">
          <div class="px-8 text-center text-gray-500 text-sm">
            <p>Developer Tools Suite - Free online utilities for developers and traders</p>
          </div>
        </footer>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import JsonDiff from './components/JsonDiff.vue'
import TradingProfit from './components/TradingProfit.vue'

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
  }
]

const currentTool = computed(() => {
  return tools.find(t => t.id === activeTool.value) || tools[0]
})
</script>

<style>
@import './style.css';
</style>
