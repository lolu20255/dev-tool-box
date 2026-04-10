<template>
  <div class="relative">
    <button
      @click="open = !open"
      class="flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 nav-inactive hover:border-cyan-500"
    >
      <!-- Avatar -->
      <div class="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center icon-active text-sm font-bold">
        <img
          v-if="user.photoURL"
          :src="user.photoURL"
          :alt="user.displayName || 'User'"
          class="w-full h-full object-cover"
          referrerpolicy="no-referrer"
        />
        <span v-else>{{ initials }}</span>
      </div>
      <span class="font-mono text-sm hidden lg:inline">{{ user.displayName || user.email }}</span>
      <svg class="w-4 h-4 muted transition-transform" :class="{ 'rotate-180': open }" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
      </svg>
    </button>

    <!-- Dropdown -->
    <Transition name="modal">
      <div v-if="open" class="absolute right-0 mt-2 w-64 cyber-modal p-1 z-50">
        <!-- Profile info -->
        <div class="px-4 py-3 border-b-2 border-accent">
          <div class="font-mono text-sm font-bold truncate">{{ user.displayName || 'User' }}</div>
          <div class="text-xs muted truncate">{{ user.email }}</div>
        </div>

        <!-- Menu items -->
        <div class="py-1">
          <button
            @click="handleProfile"
            class="w-full text-left px-4 py-2 text-sm font-mono nav-inactive hover:border-transparent flex items-center gap-3 rounded"
          >
            <span class="text-base">&#9881;</span>
            PROFILE
          </button>
          <button
            @click="handleLogout"
            class="w-full text-left px-4 py-2 text-sm font-mono nav-inactive hover:border-transparent flex items-center gap-3 rounded text-red-400"
          >
            <span class="text-base">&#9211;</span>
            LOGOUT
          </button>
        </div>
      </div>
    </Transition>

    <!-- Click-outside overlay -->
    <div v-if="open" class="fixed inset-0 z-40" @click="open = false"></div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const user = computed(() => authStore.user)
const open = ref(false)

const initials = computed(() => {
  const name = user.value?.displayName || user.value?.email || ''
  if (name.includes('@')) return name[0].toUpperCase()
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
})

const emit = defineEmits(['show-profile'])

function handleProfile() {
  open.value = false
  emit('show-profile')
}

async function handleLogout() {
  open.value = false
  await authStore.logout()
}
</script>
