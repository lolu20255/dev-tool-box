<template>
  <Transition name="modal">
    <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4" @click.self="$emit('close')">
      <div class="fixed inset-0 bg-black/60 backdrop-blur-sm"></div>

      <div class="cyber-modal relative z-10 w-full max-w-md p-8">
        <!-- Close button -->
        <button @click="$emit('close')" class="absolute top-4 right-4 muted hover:text-red-400 transition-colors text-xl">
          &#10005;
        </button>

        <!-- Header -->
        <div class="text-center mb-8">
          <h2 class="text-2xl font-orbitron font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-pink-500 to-purple-600">
            {{ isLogin ? 'ACCESS::LOGIN' : 'ACCESS::REGISTER' }}
          </h2>
          <p class="text-xs subtitle mt-2 font-mono">&gt; {{ isLogin ? 'AUTHENTICATE TO CONTINUE' : 'CREATE NEW ACCOUNT' }}</p>
        </div>

        <!-- Error -->
        <div v-if="authStore.error" class="mb-4 p-3 rounded-lg error-panel border-2 text-sm font-mono">
          <span class="color-danger">ERR:</span> {{ authStore.error }}
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div v-if="!isLogin">
            <label class="block text-xs font-mono panel-label-primary mb-1">DISPLAY NAME</label>
            <input
              v-model="displayName"
              type="text"
              placeholder="Enter your name"
              class="cyber-input rounded-lg"
            />
          </div>

          <div>
            <label class="block text-xs font-mono panel-label-primary mb-1">EMAIL</label>
            <input
              v-model="email"
              type="email"
              placeholder="user@example.com"
              required
              class="cyber-input rounded-lg"
            />
          </div>

          <div>
            <label class="block text-xs font-mono panel-label-primary mb-1">PASSWORD</label>
            <input
              v-model="password"
              type="password"
              placeholder="Enter password"
              required
              minlength="6"
              class="cyber-input rounded-lg"
            />
          </div>

          <button
            type="submit"
            :disabled="submitting"
            class="cyber-button w-full text-sm"
          >
            {{ submitting ? 'PROCESSING...' : (isLogin ? 'LOGIN' : 'REGISTER') }}
          </button>
        </form>

        <!-- Divider -->
        <div class="flex items-center gap-4 my-6">
          <div class="flex-1 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
          <span class="text-xs font-mono muted">OR</span>
          <div class="flex-1 h-px bg-gradient-to-r from-transparent via-pink-500 to-transparent"></div>
        </div>

        <!-- Google Sign-in -->
        <button
          @click="handleGoogle"
          :disabled="submitting"
          class="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 nav-inactive hover:border-cyan-500 font-mono text-sm"
        >
          <svg class="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          CONTINUE WITH GOOGLE
        </button>

        <!-- Toggle mode -->
        <p class="text-center text-sm mt-6 muted font-mono">
          {{ isLogin ? "Don't have an account?" : 'Already have an account?' }}
          <button @click="toggleMode" class="panel-label-secondary hover:underline ml-1">
            {{ isLogin ? 'REGISTER' : 'LOGIN' }}
          </button>
        </p>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'

defineProps({ show: Boolean })
const emit = defineEmits(['close'])

const authStore = useAuthStore()

const isLogin = ref(true)
const email = ref('')
const password = ref('')
const displayName = ref('')
const submitting = ref(false)

function toggleMode() {
  isLogin.value = !isLogin.value
  authStore.error = null
  email.value = ''
  password.value = ''
  displayName.value = ''
}

async function handleSubmit() {
  submitting.value = true
  try {
    if (isLogin.value) {
      await authStore.login(email.value, password.value)
    } else {
      await authStore.register(email.value, password.value, displayName.value)
    }
    emit('close')
  } catch {
    // error is set in the store
  } finally {
    submitting.value = false
  }
}

async function handleGoogle() {
  submitting.value = true
  try {
    await authStore.loginWithGoogle()
    emit('close')
  } catch {
    // error is set in the store
  } finally {
    submitting.value = false
  }
}
</script>
