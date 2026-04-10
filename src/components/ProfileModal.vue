<template>
  <Transition name="modal">
    <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4" @click.self="$emit('close')">
      <div class="fixed inset-0 bg-black/60 backdrop-blur-sm"></div>

      <div class="cyber-modal relative z-10 w-full max-w-md p-8">
        <button @click="$emit('close')" class="absolute top-4 right-4 muted hover:text-red-400 transition-colors text-xl">
          &#10005;
        </button>

        <div class="text-center mb-8">
          <h2 class="text-2xl font-orbitron font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-pink-500 to-purple-600">
            USER::PROFILE
          </h2>
          <p class="text-xs subtitle mt-2 font-mono">&gt; ACCOUNT INFORMATION</p>
        </div>

        <div class="space-y-4">
          <!-- Avatar -->
          <div class="flex justify-center">
            <div class="w-20 h-20 rounded-full overflow-hidden flex items-center justify-center icon-active text-2xl font-bold font-orbitron">
              <img
                v-if="user?.photoURL"
                :src="user.photoURL"
                :alt="user.displayName || 'User'"
                class="w-full h-full object-cover"
                referrerpolicy="no-referrer"
              />
              <span v-else>{{ initials }}</span>
            </div>
          </div>

          <!-- Info fields -->
          <div class="cyber-panel p-4 space-y-3">
            <div>
              <label class="block text-xs font-mono panel-label-secondary mb-1">DISPLAY NAME</label>
              <div class="font-mono text-sm body-text">{{ user?.displayName || 'Not set' }}</div>
            </div>
            <div class="border-t border-accent pt-3">
              <label class="block text-xs font-mono panel-label-secondary mb-1">EMAIL</label>
              <div class="font-mono text-sm body-text">{{ user?.email }}</div>
            </div>
            <div class="border-t border-accent pt-3">
              <label class="block text-xs font-mono panel-label-secondary mb-1">USER ID</label>
              <div class="font-mono text-xs muted break-all">{{ user?.uid }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '../stores/auth'

defineProps({ show: Boolean })
defineEmits(['close'])

const authStore = useAuthStore()
const user = computed(() => authStore.user)

const initials = computed(() => {
  const name = user.value?.displayName || user.value?.email || ''
  if (name.includes('@')) return name[0].toUpperCase()
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
})
</script>
