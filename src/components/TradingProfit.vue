<template>
  <div>
    <!-- Header Section -->
    <section class="mb-8 text-center">
      <h2 class="text-2xl font-orbitron text-cyan-300 mb-3">Trading Profit Calculator</h2>
      <p class="text-gray-400 max-w-3xl mx-auto mb-4">
        Paste your trading history and instantly calculate your total profit/loss. Supports futures trading data from brokers like TradingView, ThinkorSwim, and others.
      </p>
    </section>

    <!-- Input Panel -->
    <div class="cyber-panel mb-8">
      <div class="cyber-panel-header">
        <span class="text-cyan-400 font-mono">&gt; TRADING_DATA.TXT</span>
        <div class="h-2 w-2 bg-cyan-400 rounded-full animate-pulse"></div>
      </div>
      <textarea
        v-model="tradingData"
        placeholder="Paste your trading history here...

Example:
/MNQH26 Limit Sell
+$7.89
-3 @25,336.25

/MNQH26 Market Buy
-$2.61
+3 @25,334.50"
        class="cyber-input"
        rows="15"
      ></textarea>
    </div>

    <!-- Calculate Button -->
    <div class="flex justify-center mb-8">
      <button
        @click="calculateProfit"
        class="cyber-button group"
        :disabled="isCalculating"
      >
        <span class="relative z-10 flex items-center gap-3">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          {{ isCalculating ? 'CALCULATING...' : 'CALCULATE PROFIT' }}
        </span>
      </button>
    </div>

    <!-- Error Message -->
    <div v-if="errorMessage" class="cyber-panel border-red-500 bg-red-900 bg-opacity-20 mb-6">
      <div class="cyber-panel-header border-red-500">
        <span class="text-red-400 font-mono">&gt; ERROR</span>
      </div>
      <div class="p-4 text-red-300 font-mono">{{ errorMessage }}</div>
    </div>

    <!-- Results -->
    <div v-if="hasResults" class="space-y-6">
      <!-- Summary Stats -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="cyber-stat">
          <div :class="totalProfit >= 0 ? 'text-green-400' : 'text-red-400'" class="text-3xl font-bold font-mono">
            {{ totalProfit >= 0 ? '+' : '' }}${{ totalProfit.toFixed(2) }}
          </div>
          <div class="text-xs text-gray-400 mt-1">TOTAL P&L</div>
        </div>
        <div class="cyber-stat">
          <div class="text-green-400 text-3xl font-bold font-mono">${{ totalGains.toFixed(2) }}</div>
          <div class="text-xs text-gray-400 mt-1">TOTAL GAINS</div>
        </div>
        <div class="cyber-stat">
          <div class="text-red-400 text-3xl font-bold font-mono">-${{ Math.abs(totalLosses).toFixed(2) }}</div>
          <div class="text-xs text-gray-400 mt-1">TOTAL LOSSES</div>
        </div>
        <div class="cyber-stat">
          <div class="text-cyan-400 text-3xl font-bold font-mono">{{ tradeCount }}</div>
          <div class="text-xs text-gray-400 mt-1">EXECUTED TRADES</div>
        </div>
      </div>

      <!-- Win Rate -->
      <div class="cyber-panel p-6">
        <div class="flex items-center justify-between mb-4">
          <span class="text-cyan-400 font-mono">&gt; PERFORMANCE METRICS</span>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <div class="text-gray-400 text-sm mb-1">Win Rate</div>
            <div class="text-2xl font-bold" :class="winRate >= 50 ? 'text-green-400' : 'text-yellow-400'">
              {{ winRate.toFixed(1) }}%
            </div>
          </div>
          <div>
            <div class="text-gray-400 text-sm mb-1">Winning Trades</div>
            <div class="text-2xl font-bold text-green-400">{{ winningTrades }}</div>
          </div>
          <div>
            <div class="text-gray-400 text-sm mb-1">Losing Trades</div>
            <div class="text-2xl font-bold text-red-400">{{ losingTrades }}</div>
          </div>
          <div>
            <div class="text-gray-400 text-sm mb-1">Avg Trade</div>
            <div class="text-2xl font-bold" :class="avgTrade >= 0 ? 'text-green-400' : 'text-red-400'">
              {{ avgTrade >= 0 ? '+' : '' }}${{ avgTrade.toFixed(2) }}
            </div>
          </div>
        </div>
      </div>

      <!-- Trade List -->
      <div class="cyber-panel">
        <div class="cyber-panel-header">
          <span class="text-cyan-400 font-mono">&gt; TRADE_LOG [{{ trades.length }}]</span>
          <button @click="showAllTrades = !showAllTrades" class="text-pink-400 hover:text-pink-300 text-sm font-mono">
            {{ showAllTrades ? 'COLLAPSE' : 'EXPAND' }}
          </button>
        </div>
        <div v-if="showAllTrades" class="max-h-96 overflow-y-auto">
          <div
            v-for="(trade, index) in trades"
            :key="index"
            class="flex items-center justify-between px-4 py-2 border-b border-gray-800 hover:bg-gray-900"
          >
            <div class="flex items-center gap-4">
              <span class="text-gray-500 font-mono text-xs w-8">{{ index + 1 }}</span>
              <span class="text-gray-400 font-mono text-sm">{{ trade.symbol }}</span>
              <span :class="trade.type === 'Buy' ? 'text-green-400' : 'text-red-400'" class="font-mono text-sm">
                {{ trade.type }}
              </span>
            </div>
            <div :class="trade.pnl >= 0 ? 'text-green-400' : 'text-red-400'" class="font-mono font-bold">
              {{ trade.pnl >= 0 ? '+' : '' }}${{ trade.pnl.toFixed(2) }}
            </div>
          </div>
        </div>
        <div v-else class="p-4 text-gray-500 text-center font-mono text-sm">
          Click EXPAND to view all trades
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const tradingData = ref('')
const isCalculating = ref(false)
const errorMessage = ref('')
const trades = ref([])
const showAllTrades = ref(false)

const hasResults = computed(() => trades.value.length > 0)

const totalGains = computed(() => {
  return trades.value.filter(t => t.pnl > 0).reduce((sum, t) => sum + t.pnl, 0)
})

const totalLosses = computed(() => {
  return trades.value.filter(t => t.pnl < 0).reduce((sum, t) => sum + t.pnl, 0)
})

const totalProfit = computed(() => {
  return trades.value.reduce((sum, t) => sum + t.pnl, 0)
})

const tradeCount = computed(() => trades.value.length)

const winningTrades = computed(() => trades.value.filter(t => t.pnl > 0).length)
const losingTrades = computed(() => trades.value.filter(t => t.pnl < 0).length)

const winRate = computed(() => {
  if (trades.value.length === 0) return 0
  return (winningTrades.value / trades.value.length) * 100
})

const avgTrade = computed(() => {
  if (trades.value.length === 0) return 0
  return totalProfit.value / trades.value.length
})

function calculateProfit() {
  errorMessage.value = ''
  isCalculating.value = true
  trades.value = []

  try {
    const parsedTrades = parseTradingData(tradingData.value)

    setTimeout(() => {
      trades.value = parsedTrades
      isCalculating.value = false
      if (parsedTrades.length === 0) {
        errorMessage.value = 'No executed trades found in the data. Make sure your data contains P&L values like "+$7.89" or "-$2.61".'
      }
    }, 300)
  } catch (error) {
    isCalculating.value = false
    errorMessage.value = `PARSE ERROR: ${error.message}`
  }
}

function parseTradingData(data) {
  const lines = data.split('\n')
  const trades = []

  let currentSymbol = ''
  let currentType = ''

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()

    // Skip empty lines and cancelled/rejected orders
    if (!line || line.includes('Cancelled') || line.includes('Rejected')) {
      continue
    }

    // Check for symbol and order type (e.g., "/MNQH26 Limit Sell")
    const symbolMatch = line.match(/^(\/\w+)\s+(Limit|Market)\s+(Buy|Sell)/)
    if (symbolMatch) {
      currentSymbol = symbolMatch[1]
      currentType = symbolMatch[3]
      continue
    }

    // Check for P&L value (e.g., "+$7.89" or "-$121.11")
    const pnlMatch = line.match(/^([+-])\$(\d+(?:,\d{3})*(?:\.\d{1,2})?)$/)
    if (pnlMatch && currentSymbol) {
      const sign = pnlMatch[1] === '+' ? 1 : -1
      const value = parseFloat(pnlMatch[2].replace(/,/g, ''))
      const pnl = sign * value

      trades.push({
        symbol: currentSymbol,
        type: currentType,
        pnl: pnl
      })
    }
  }

  return trades
}
</script>
