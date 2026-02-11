<template>
  <div>
    <!-- SEO Content Section -->
    <section class="mb-8 text-center">
      <h2 class="text-2xl font-orbitron text-cyan-300 mb-3">Compare JSON Objects Online - Free JSON Diff Tool</h2>
      <p class="text-gray-400 max-w-3xl mx-auto mb-4">
        Instantly compare two JSON objects and detect differences. Our free online JSON diff tool helps developers identify added, modified, and removed properties in API responses, product data, and configuration files.
      </p>
    </section>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <!-- Before JSON -->
      <div class="cyber-panel">
        <div class="cyber-panel-header">
          <span class="text-cyan-400 font-mono">&gt; BEFORE.JSON</span>
          <div class="h-2 w-2 bg-cyan-400 rounded-full animate-pulse"></div>
        </div>
        <textarea
          v-model="beforeJson"
          placeholder='{"status": "before", "data": {...}}'
          class="cyber-input"
          rows="15"
        ></textarea>
      </div>

      <!-- After JSON -->
      <div class="cyber-panel">
        <div class="cyber-panel-header">
          <span class="text-pink-400 font-mono">&gt; AFTER.JSON</span>
          <div class="h-2 w-2 bg-pink-400 rounded-full animate-pulse"></div>
        </div>
        <textarea
          v-model="afterJson"
          placeholder='{"status": "after", "data": {...}}'
          class="cyber-input"
          rows="15"
        ></textarea>
      </div>
    </div>

    <!-- Compare Button -->
    <div class="flex justify-center mb-8">
      <button
        @click="compareJson"
        class="cyber-button group"
        :disabled="isComparing"
      >
        <span class="relative z-10 flex items-center gap-3">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          {{ isComparing ? 'PROCESSING...' : 'INITIATE COMPARISON' }}
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

    <!-- Results Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-80 backdrop-blur-sm" @click.self="closeModal">
          <div class="cyber-modal max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div class="cyber-panel-header border-b-2 border-cyan-500">
              <span class="text-cyan-400 font-mono">&gt; COMPARISON RESULTS</span>
              <button @click="closeModal" class="text-pink-400 hover:text-pink-300 transition-colors">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div class="flex-1 overflow-y-auto p-6">
              <div class="grid grid-cols-3 gap-4 mb-6">
                <div class="cyber-stat">
                  <div class="text-green-400 text-3xl font-bold">{{ results.added.length }}</div>
                  <div class="text-xs text-gray-400">ADDED</div>
                </div>
                <div class="cyber-stat">
                  <div class="text-yellow-400 text-3xl font-bold">{{ results.modified.length }}</div>
                  <div class="text-xs text-gray-400">MODIFIED</div>
                </div>
                <div class="cyber-stat">
                  <div class="text-red-400 text-3xl font-bold">{{ results.removed.length }}</div>
                  <div class="text-xs text-gray-400">REMOVED</div>
                </div>
              </div>

              <div v-if="!hasChanges" class="text-center py-12">
                <div class="text-6xl mb-4">✓</div>
                <div class="text-2xl text-cyan-400 font-orbitron">NO DIFFERENCES DETECTED</div>
                <div class="text-gray-500 mt-2">Objects are identical</div>
              </div>

              <div v-if="results.added.length > 0" class="mb-6">
                <h3 class="text-green-400 font-mono text-lg mb-3 flex items-center gap-2">
                  <span class="text-2xl">+</span> ADDED PROPERTIES
                </h3>
                <div class="space-y-2">
                  <div v-for="(item, index) in results.added" :key="'add-' + index" class="cyber-diff-item border-green-500">
                    <div class="font-mono text-sm text-green-300">{{ item.path }}</div>
                    <div class="mt-1 text-gray-300 font-mono text-xs bg-green-900 bg-opacity-30 p-2 rounded">
                      {{ formatValue(item.value) }}
                    </div>
                  </div>
                </div>
              </div>

              <div v-if="results.modified.length > 0" class="mb-6">
                <h3 class="text-yellow-400 font-mono text-lg mb-3 flex items-center gap-2">
                  <span class="text-2xl">~</span> MODIFIED PROPERTIES
                </h3>
                <div class="space-y-2">
                  <div v-for="(item, index) in results.modified" :key="'mod-' + index" class="cyber-diff-item border-yellow-500">
                    <div class="font-mono text-sm text-yellow-300">{{ item.path }}</div>
                    <div class="mt-2 grid grid-cols-2 gap-2">
                      <div>
                        <div class="text-xs text-red-400 mb-1">BEFORE:</div>
                        <div class="text-gray-300 font-mono text-xs bg-red-900 bg-opacity-30 p-2 rounded">
                          {{ formatValue(item.oldValue) }}
                        </div>
                      </div>
                      <div>
                        <div class="text-xs text-green-400 mb-1">AFTER:</div>
                        <div class="text-gray-300 font-mono text-xs bg-green-900 bg-opacity-30 p-2 rounded">
                          {{ formatValue(item.newValue) }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div v-if="results.removed.length > 0" class="mb-6">
                <h3 class="text-red-400 font-mono text-lg mb-3 flex items-center gap-2">
                  <span class="text-2xl">-</span> REMOVED PROPERTIES
                </h3>
                <div class="space-y-2">
                  <div v-for="(item, index) in results.removed" :key="'rem-' + index" class="cyber-diff-item border-red-500">
                    <div class="font-mono text-sm text-red-300">{{ item.path }}</div>
                    <div class="mt-1 text-gray-300 font-mono text-xs bg-red-900 bg-opacity-30 p-2 rounded">
                      {{ formatValue(item.value) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="border-t-2 border-cyan-500 p-4 flex justify-end">
              <button @click="closeModal" class="cyber-button-secondary">CLOSE</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const beforeJson = ref('')
const afterJson = ref('')
const showModal = ref(false)
const isComparing = ref(false)
const errorMessage = ref('')
const results = ref({ added: [], modified: [], removed: [] })

const hasChanges = computed(() => {
  return results.value.added.length > 0 ||
         results.value.modified.length > 0 ||
         results.value.removed.length > 0
})

function compareJson() {
  errorMessage.value = ''
  isComparing.value = true

  try {
    const before = JSON.parse(beforeJson.value || '{}')
    const after = JSON.parse(afterJson.value || '{}')
    const B = scope(before, false)
    const A = scope(after, false)
    const BM = flatten(B)
    const AM = flatten(A)
    const diff = compareFlattened(BM, AM)
    results.value = diff

    setTimeout(() => {
      isComparing.value = false
      showModal.value = true
    }, 500)
  } catch (error) {
    isComparing.value = false
    errorMessage.value = `PARSE ERROR: ${error.message}`
  }
}

function pointer(p) {
  return '/' + p.map(x => String(x)).join('/')
}

function flatten(obj, currentPath = []) {
  const result = {}
  for (const key in obj) {
    const value = obj[key]
    const newPath = [...currentPath, key]
    if (value === null || typeof value !== 'object') {
      result[pointer(newPath)] = value
    } else if (Array.isArray(value)) {
      value.forEach((item, index) => {
        const arrayPath = [...newPath, index]
        if (item === null || typeof item !== 'object') {
          result[pointer(arrayPath)] = item
        } else {
          Object.assign(result, flatten(item, arrayPath))
        }
      })
    } else {
      Object.assign(result, flatten(value, newPath))
    }
  }
  return result
}

function scope(o, withVariants) {
  const prod = o.response?.products?.[0] || o.products?.[0] || o
  if (withVariants) {
    return prod
  } else {
    const { variants, ...rest } = prod
    return rest
  }
}

function compareFlattened(BM, AM) {
  const beforeKeys = new Set(Object.keys(BM))
  const afterKeys = new Set(Object.keys(AM))
  const addedKeys = [...afterKeys].filter(k => !beforeKeys.has(k)).sort()
  const removedKeys = [...beforeKeys].filter(k => !afterKeys.has(k)).sort()
  const changedKeys = [...afterKeys].filter(k => beforeKeys.has(k) && BM[k] !== AM[k]).sort()

  return {
    added: addedKeys.map(k => ({ path: k, value: AM[k] })),
    modified: changedKeys.map(k => ({ path: k, oldValue: BM[k], newValue: AM[k] })),
    removed: removedKeys.map(k => ({ path: k, value: BM[k] }))
  }
}

function formatValue(value) {
  if (value === null) return 'null'
  if (value === undefined) return 'undefined'
  if (typeof value === 'object') return JSON.stringify(value, null, 2)
  return String(value)
}

function closeModal() {
  showModal.value = false
}
</script>
