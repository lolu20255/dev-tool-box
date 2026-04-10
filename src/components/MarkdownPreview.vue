<template>
  <div>
    <!-- SEO Content Section -->
    <section class="mb-8 text-center">
      <h2 class="text-2xl font-orbitron mb-3 section-title">Markdown Preview - Drop & Render</h2>
      <p class="muted max-w-3xl mx-auto mb-4 ">
        Drop a <code class="subtitle">.md</code> file or paste markdown content to instantly preview it as rendered HTML.
      </p>
    </section>

    <!-- Saved Files Dropdown -->
    <div v-if="user && savedFiles.length" class="cyber-panel mb-4">
      <div class="cyber-panel-header">
        <span class="panel-label-primary font-mono">&gt; SAVED FILES</span>
        <div class="h-2 w-2 dot-primary rounded-full animate-pulse"></div>
      </div>
      <div class="p-4 flex items-center gap-3">
        <select
          v-model="selectedFileId"
          @change="loadSavedFile"
          class="cyber-input rounded-lg flex-1 py-2"
        >
          <option value="">-- Select a saved file --</option>
          <option v-for="file in savedFiles" :key="file.id" :value="file.id">
            {{ file.name }}
          </option>
        </select>
        <button
          v-if="selectedFileId"
          @click="deleteSavedFile"
          :disabled="deleting"
          class="cyber-button text-xs px-3 py-2 !bg-red-600 hover:!bg-red-500"
        >{{ deleting ? '...' : 'DELETE' }}</button>
      </div>
    </div>

    <!-- Cloud save hint -->
    <div v-if="user" class="mb-4 flex items-center gap-2 px-1 text-xs font-mono muted">
      <span class="text-base">&#9729;</span>
      Saved files are stored in the cloud. Log in from any device to access your markdown content.
    </div>
    <div v-else class="mb-4 flex items-center gap-2 px-1 text-xs font-mono muted">
      <span class="text-base">&#9729;</span>
      Log in to save your markdown files to the cloud and access them anytime.
    </div>

    <!-- Drop Zone -->
    <div
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="handleDrop"
      :class="[
        'cyber-panel mb-8 transition-all duration-300 cursor-pointer',
        isDragging ? 'border-pink-500 bg-pink-900 bg-opacity-20' : ''
      ]"
      @click="triggerFileInput"
    >
      <div class="cyber-panel-header">
        <span class="panel-label-primary font-mono">&gt; INPUT.MD</span>
        <div class="flex items-center gap-3">
          <button
            v-if="user && markdownSource"
            @click.stop="promptSave"
            :disabled="saving"
            class="cyber-button text-xs px-3 py-1"
          >{{ saving ? 'SAVING...' : 'SAVE' }}</button>
          <button
            v-if="markdownSource"
            @click.stop="clearContent"
            class="cyber-button text-xs px-3 py-1"
          >CLEAR</button>
          <div class="h-2 w-2 dot-primary rounded-full animate-pulse"></div>
        </div>
      </div>

      <input
        ref="fileInput"
        type="file"
        accept=".md,.markdown,.txt"
        class="hidden"
        @change="handleFileSelect"
      />

      <!-- Drop prompt -->
      <div v-if="!markdownSource" class="py-16 text-center">
        <div class="text-5xl mb-4 opacity-60">
          <span v-html="'&#128462;'"></span>
        </div>
        <p class="  mb-2 ">DROP .MD FILE HERE</p>
        <p class="muted text-sm">or click to browse &middot; or paste below</p>
      </div>

      <!-- Markdown editor -->
      <textarea
        v-model="markdownSource"
        placeholder="# Paste your markdown here..."
        class="cyber-input"
        rows="12"
        @click.stop
      ></textarea>

      <div v-if="fileName" class="px-4 pb-3 text-xs muted font-mono">
        LOADED: {{ fileName }}
      </div>
    </div>

    <!-- Rendered Output -->
    <div v-if="markdownSource" class="cyber-panel">
      <div class="cyber-panel-header">
        <span class="panel-label-secondary font-mono">&gt; RENDERED.HTML</span>
        <div class="flex items-center gap-3">
          <button
            @click="downloadHtml"
            class="cyber-button text-xs px-3 py-1"
          >DOWNLOAD HTML</button>
          <button
            @click="copyHtml"
            class="cyber-button text-xs px-3 py-1"
          >{{ copied ? 'COPIED!' : 'COPY HTML' }}</button>
          <div class="h-2 w-2 dot-secondary rounded-full animate-pulse"></div>
        </div>
      </div>

      <div class="p-6 markdown-body" v-html="renderedHtml"></div>
    </div>

    <!-- Save Modal -->
    <Transition name="modal">
      <div v-if="showSaveModal" class="fixed inset-0 z-50 flex items-center justify-center p-4" @click.self="showSaveModal = false">
        <div class="fixed inset-0 bg-black/60 backdrop-blur-sm"></div>
        <div class="cyber-modal relative z-10 w-full max-w-sm p-6">
          <h3 class="text-lg font-orbitron font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-pink-500 to-purple-600 mb-4">
            SAVE::FILE
          </h3>
          <label class="block text-xs font-mono panel-label-primary mb-1">FILE NAME</label>
          <input
            v-model="saveName"
            type="text"
            placeholder="my-document.md"
            class="cyber-input rounded-lg mb-4"
            @keyup.enter="confirmSave"
          />
          <div class="flex justify-end gap-3">
            <button @click="showSaveModal = false" class="cyber-button-secondary text-xs px-4 py-2">CANCEL</button>
            <button @click="confirmSave" :disabled="!saveName.trim() || saving" class="cyber-button text-xs px-4 py-2">
              {{ saving ? 'SAVING...' : 'SAVE' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { marked } from 'marked'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '../stores/auth'
import { useToast } from '../composables/useToast'
import { db } from '../firebase'
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy,
  serverTimestamp
} from 'firebase/firestore'

marked.setOptions({
  breaks: true,
  gfm: true
})

const authStore = useAuthStore()
const { user } = storeToRefs(authStore)
const toast = useToast()

const markdownSource = ref('')
const fileName = ref('')
const isDragging = ref(false)
const copied = ref(false)
const fileInput = ref(null)

// Saved files state
const savedFiles = ref([])
const selectedFileId = ref('')
const saving = ref(false)
const deleting = ref(false)
const showSaveModal = ref(false)
const saveName = ref('')

const renderedHtml = computed(() => {
  if (!markdownSource.value) return ''
  return marked.parse(markdownSource.value)
})

// Fetch saved files when user changes
watch(user, (u) => {
  if (u) {
    fetchSavedFiles()
  } else {
    savedFiles.value = []
    selectedFileId.value = ''
  }
}, { immediate: true })

async function fetchSavedFiles() {
  if (!user.value) return
  const q = query(
    collection(db, 'users', user.value.uid, 'markdownFiles'),
    orderBy('createdAt', 'desc')
  )
  const snapshot = await getDocs(q)
  savedFiles.value = snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
}

function loadSavedFile() {
  const file = savedFiles.value.find(f => f.id === selectedFileId.value)
  if (file) {
    markdownSource.value = file.content
    fileName.value = file.name
  }
}

function promptSave() {
  saveName.value = fileName.value || ''
  showSaveModal.value = true
}

async function confirmSave() {
  if (!saveName.value.trim() || !user.value) return
  saving.value = true
  try {
    await addDoc(collection(db, 'users', user.value.uid, 'markdownFiles'), {
      name: saveName.value.trim(),
      content: markdownSource.value,
      createdAt: serverTimestamp()
    })
    showSaveModal.value = false
    toast.success(`"${saveName.value.trim()}" saved to cloud`)
    await fetchSavedFiles()
  } catch {
    toast.error('Failed to save file. Please try again.')
  } finally {
    saving.value = false
  }
}

async function deleteSavedFile() {
  if (!selectedFileId.value || !user.value) return
  const deletedName = savedFiles.value.find(f => f.id === selectedFileId.value)?.name
  deleting.value = true
  try {
    await deleteDoc(doc(db, 'users', user.value.uid, 'markdownFiles', selectedFileId.value))
    selectedFileId.value = ''
    markdownSource.value = ''
    fileName.value = ''
    toast.success(`"${deletedName}" deleted from cloud`)
    await fetchSavedFiles()
  } catch {
    toast.error('Failed to delete file. Please try again.')
  } finally {
    deleting.value = false
  }
}

function triggerFileInput() {
  fileInput.value?.click()
}

function handleFileSelect(e) {
  const file = e.target.files?.[0]
  if (file) loadFile(file)
}

function handleDrop(e) {
  isDragging.value = false
  const file = e.dataTransfer.files?.[0]
  if (file) loadFile(file)
}

function loadFile(file) {
  fileName.value = file.name
  selectedFileId.value = ''
  const reader = new FileReader()
  reader.onload = (e) => {
    markdownSource.value = e.target.result
  }
  reader.readAsText(file)
}

function clearContent() {
  markdownSource.value = ''
  fileName.value = ''
  selectedFileId.value = ''
  if (fileInput.value) fileInput.value.value = ''
}

function copyHtml() {
  navigator.clipboard.writeText(renderedHtml.value)
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}

function downloadHtml() {
  const htmlDoc = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${fileName.value || 'markdown-preview'}</title>
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 900px; margin: 2rem auto; padding: 0 1rem; line-height: 1.6; color: #1a1a1a; }
  pre { background: #f5f5f5; padding: 1rem; border-radius: 6px; overflow-x: auto; }
  code { background: #f0f0f0; padding: 0.15em 0.4em; border-radius: 3px; font-size: 0.9em; }
  pre code { background: none; padding: 0; }
  blockquote { border-left: 4px solid #ddd; margin: 1rem 0; padding: 0.5rem 1rem; color: #555; }
  table { border-collapse: collapse; width: 100%; margin: 1rem 0; }
  th, td { border: 1px solid #ddd; padding: 0.6rem; text-align: left; }
  th { background: #f5f5f5; }
  img { max-width: 100%; }
  a { color: #0366d6; }
</style>
</head>
<body>
${renderedHtml.value}
</body>
</html>`
  const blob = new Blob([htmlDoc], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = (fileName.value || 'preview').replace(/\.(md|markdown|txt)$/i, '') + '.html'
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<style scoped>
.markdown-body {
  color: var(--md-text, #e2e8f0);
  line-height: 1.7;
  font-family: 'Rajdhani', sans-serif;
  font-size: 1.05rem;
}

.markdown-body :deep(h1) {
  font-family: 'Orbitron', sans-serif;
  font-size: 2rem;
  font-weight: 900;
  background: var(--md-h1-gradient, linear-gradient(to right, #06b6d4, #ec4899));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 1.5rem 0 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--md-border, #164e63);
}

.markdown-body :deep(h2) {
  font-family: 'Orbitron', sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--md-h2, #06b6d4);
  margin: 1.25rem 0 0.75rem;
  padding-bottom: 0.3rem;
  border-bottom: 1px solid var(--md-border, #164e63);
}

.markdown-body :deep(h3) {
  font-family: 'Orbitron', sans-serif;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--md-h3, #67e8f9);
  margin: 1rem 0 0.5rem;
}

.markdown-body :deep(h4),
.markdown-body :deep(h5),
.markdown-body :deep(h6) {
  font-family: 'Orbitron', sans-serif;
  color: var(--md-h4, #a5f3fc);
  margin: 0.75rem 0 0.5rem;
}

.markdown-body :deep(p) {
  margin: 0.75rem 0;
  color: var(--md-p, #cbd5e1);
}

.markdown-body :deep(a) {
  color: var(--md-link, #ec4899);
  text-decoration: underline;
  text-underline-offset: 2px;
  transition: color 0.2s;
}

.markdown-body :deep(a:hover) {
  color: var(--md-link-hover, #f472b6);
}

.markdown-body :deep(strong) {
  color: var(--md-strong, #e2e8f0);
  font-weight: 700;
}

.markdown-body :deep(em) {
  color: var(--md-em, #a78bfa);
}

.markdown-body :deep(code) {
  background: var(--md-code-bg, rgba(6, 182, 212, 0.15));
  color: var(--md-code, #67e8f9);
  padding: 0.15em 0.4em;
  border-radius: 4px;
  font-family: monospace;
  font-size: 0.9em;
}

.markdown-body :deep(pre) {
  background: var(--md-pre-bg, #0a0a1a);
  border: 1px solid var(--md-border, #164e63);
  border-radius: 8px;
  padding: 1rem;
  overflow-x: auto;
  margin: 1rem 0;
}

.markdown-body :deep(pre code) {
  background: none;
  padding: 0;
  color: var(--md-pre-code, #a5f3fc);
  font-size: 0.85rem;
}

.markdown-body :deep(blockquote) {
  border-left: 4px solid var(--md-bq-border, #ec4899);
  padding: 0.5rem 1rem;
  margin: 1rem 0;
  background: var(--md-bq-bg, rgba(236, 72, 153, 0.08));
  color: var(--md-bq, #f9a8d4);
  border-radius: 0 8px 8px 0;
}

.markdown-body :deep(ul),
.markdown-body :deep(ol) {
  padding-left: 1.5rem;
  margin: 0.75rem 0;
  color: var(--md-p, #cbd5e1);
}

.markdown-body :deep(ul) { list-style-type: disc; }
.markdown-body :deep(ol) { list-style-type: decimal; }
.markdown-body :deep(li) { margin: 0.35rem 0; }

.markdown-body :deep(li::marker) {
  color: var(--md-accent, #06b6d4);
}

.markdown-body :deep(hr) {
  border: none;
  height: 2px;
  background: var(--md-hr, linear-gradient(to right, transparent, #06b6d4, #ec4899, transparent));
  margin: 2rem 0;
}

.markdown-body :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;
}

.markdown-body :deep(th) {
  background: var(--md-th-bg, rgba(6, 182, 212, 0.2));
  color: var(--md-accent, #06b6d4);
  font-family: 'Orbitron', sans-serif;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 0.75rem;
  text-align: left;
  border-bottom: 2px solid var(--md-border, #164e63);
}

.markdown-body :deep(td) {
  padding: 0.6rem 0.75rem;
  border-bottom: 1px solid var(--md-td-border, #1e293b);
  color: var(--md-p, #cbd5e1);
}

.markdown-body :deep(tr:hover td) {
  background: var(--md-hover, rgba(6, 182, 212, 0.05));
}

.markdown-body :deep(img) {
  max-width: 100%;
  border-radius: 8px;
  border: 1px solid var(--md-border, #164e63);
  margin: 1rem 0;
}

.markdown-body :deep(input[type="checkbox"]) {
  accent-color: var(--md-accent, #06b6d4);
  margin-right: 0.5rem;
}
</style>
