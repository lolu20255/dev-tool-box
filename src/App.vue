<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-cyan-400 font-rajdhani">
    <!-- Animated background grid -->
    <div class="fixed inset-0 bg-grid-cyan opacity-10 animate-pulse-slow"></div>

    <!-- Scanline effect -->
    <div class="fixed inset-0 scanlines pointer-events-none"></div>

    <div class="relative z-10">
      <!-- Header -->
      <header class="border-b-2 border-cyan-500 bg-black bg-opacity-80 backdrop-blur-sm">
        <div class="container mx-auto px-4 py-6">
          <h1 class="text-5xl font-orbitron font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-pink-500 to-purple-600 animate-glow">
            JSON::DIFF
          </h1>
          <p class="text-sm text-pink-400 mt-2 font-mono">&gt; PRODUCT DATA COMPARISON ENGINE</p>
        </div>
      </header>

      <!-- Main Content -->
      <main class="container mx-auto px-4 py-8">
        <!-- SEO Content Section -->
        <section class="mb-8 text-center">
          <h2 class="text-2xl font-orbitron text-cyan-300 mb-3">Compare JSON Objects Online - Free JSON Diff Tool</h2>
          <p class="text-gray-400 max-w-3xl mx-auto mb-4">
            Instantly compare two JSON objects and detect differences. Our free online JSON diff tool helps developers identify added, modified, and removed properties in API responses, product data, and configuration files. Perfect for API testing, debugging, and data validation.
          </p>
          <div class="flex flex-wrap justify-center gap-2 text-xs text-gray-500">
            <span class="px-2 py-1 bg-cyan-900 bg-opacity-30 rounded">#JSONDiff</span>
            <span class="px-2 py-1 bg-cyan-900 bg-opacity-30 rounded">#JSONCompare</span>
            <span class="px-2 py-1 bg-cyan-900 bg-opacity-30 rounded">#DiffChecker</span>
            <span class="px-2 py-1 bg-cyan-900 bg-opacity-30 rounded">#APITesting</span>
            <span class="px-2 py-1 bg-cyan-900 bg-opacity-30 rounded">#DeveloperTools</span>
          </div>
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
              aria-label="Paste your before JSON here"
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
              aria-label="Paste your after JSON here"
            ></textarea>
          </div>
        </div>

        <!-- Compare Button -->
        <div class="flex justify-center mb-8">
          <button
            @click="compareJson"
            class="cyber-button group"
            :disabled="isComparing"
            aria-label="Compare JSON objects"
          >
            <span class="relative z-10 flex items-center gap-3">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              {{ isComparing ? 'PROCESSING...' : 'INITIATE COMPARISON' }}
            </span>
          </button>
        </div>

        <!-- Error Message -->
        <div v-if="errorMessage" class="cyber-panel border-red-500 bg-red-900 bg-opacity-20 mb-6" role="alert">
          <div class="cyber-panel-header border-red-500">
            <span class="text-red-400 font-mono">&gt; ERROR</span>
          </div>
          <div class="p-4 text-red-300 font-mono">{{ errorMessage }}</div>
        </div>

        <!-- Features Section for SEO -->
        <section class="mt-12 mb-8">
          <h3 class="text-xl font-orbitron text-cyan-300 mb-4 text-center">Features</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <article class="cyber-panel p-4">
              <h4 class="text-green-400 font-bold mb-2">Detect Added Properties</h4>
              <p class="text-gray-400 text-sm">Instantly identify new fields and properties added to your JSON objects</p>
            </article>
            <article class="cyber-panel p-4">
              <h4 class="text-yellow-400 font-bold mb-2">Track Modifications</h4>
              <p class="text-gray-400 text-sm">See exactly what values changed between JSON versions with side-by-side comparison</p>
            </article>
            <article class="cyber-panel p-4">
              <h4 class="text-red-400 font-bold mb-2">Find Removed Data</h4>
              <p class="text-gray-400 text-sm">Quickly spot deleted properties and missing data in your JSON structures</p>
            </article>
          </div>
        </section>

        <!-- Use Cases Section -->
        <section class="mb-8">
          <h3 class="text-xl font-orbitron text-cyan-300 mb-4 text-center">Use Cases</h3>
          <div class="max-w-3xl mx-auto text-gray-400 space-y-3 text-sm">
            <p><strong class="text-cyan-300">API Testing:</strong> Compare API responses before and after changes to ensure backward compatibility</p>
            <p><strong class="text-cyan-300">Product Data Management:</strong> Track changes in product catalogs, inventory, and e-commerce data</p>
            <p><strong class="text-cyan-300">Configuration Files:</strong> Validate changes in JSON configuration files and settings</p>
            <p><strong class="text-cyan-300">Data Validation:</strong> Verify data migrations and transformations are correct</p>
            <p><strong class="text-cyan-300">Debugging:</strong> Identify unexpected changes in JSON data structures during development</p>
          </div>
        </section>
      </main>

      <!-- Footer -->
      <footer class="border-t-2 border-cyan-500 bg-black bg-opacity-80 py-6">
        <div class="container mx-auto px-4 text-center text-gray-500 text-sm">
          <p>Free online JSON diff and comparison tool for developers</p>
          <p class="mt-2">Compare JSON | JSON Diff Checker | API Testing Tool</p>
        </div>
      </footer>
    </div>

    <!-- Results Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-80 backdrop-blur-sm" @click.self="closeModal">
          <div class="cyber-modal max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <!-- Modal Header -->
            <div class="cyber-panel-header border-b-2 border-cyan-500">
              <span class="text-cyan-400 font-mono">&gt; COMPARISON RESULTS</span>
              <button @click="closeModal" class="text-pink-400 hover:text-pink-300 transition-colors">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Modal Body -->
            <div class="flex-1 overflow-y-auto p-6">
              <!-- Summary -->
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

              <!-- No Changes -->
              <div v-if="!hasChanges" class="text-center py-12">
                <div class="text-6xl mb-4">✓</div>
                <div class="text-2xl text-cyan-400 font-orbitron">NO DIFFERENCES DETECTED</div>
                <div class="text-gray-500 mt-2">Objects are identical</div>
              </div>

              <!-- Added Items -->
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

              <!-- Modified Items -->
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

              <!-- Removed Items -->
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

            <!-- Modal Footer -->
            <div class="border-t-2 border-cyan-500 p-4 flex justify-end">
              <button @click="closeModal" class="cyber-button-secondary">
                CLOSE
              </button>
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
const results = ref({
  added: [],
  modified: [],
  removed: []
})

const hasChanges = computed(() => {
  return results.value.added.length > 0 ||
         results.value.modified.length > 0 ||
         results.value.removed.length > 0
})

function compareJson() {
  errorMessage.value = ''
  isComparing.value = true

  try {
    // Parse JSON
    const before = JSON.parse(beforeJson.value || '{}')
    const after = JSON.parse(afterJson.value || '{}')

    // Scope to products[0] if available (matching compare_product_json.js logic)
    const B = scope(before, false)
    const A = scope(after, false)

    // Flatten both objects
    const BM = flatten(B)
    const AM = flatten(A)

    // Compare flattened structures
    const diff = compareFlattened(BM, AM)
    results.value = diff

    // Show modal
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
  // Check if it has response.products[0] or products[0] structure
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
  const changedKeys = [...afterKeys]
    .filter(k => beforeKeys.has(k) && BM[k] !== AM[k])
    .sort()

  const added = addedKeys.map(k => ({ path: k, value: AM[k] }))
  const removed = removedKeys.map(k => ({ path: k, value: BM[k] }))
  const modified = changedKeys.map(k => ({
    path: k,
    oldValue: BM[k],
    newValue: AM[k]
  }))

  return { added, modified, removed }
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

<style>
@import './style.css';
</style>
