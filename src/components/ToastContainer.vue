<template>
  <div class="fixed top-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
    <TransitionGroup name="toast">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        :class="[
          'pointer-events-auto px-5 py-3 rounded-lg font-mono text-sm shadow-lg backdrop-blur-md border-2 flex items-center gap-3 min-w-[280px]',
          toast.type === 'success' ? 'border-green-500 bg-green-950/80 text-green-300' : '',
          toast.type === 'error' ? 'border-red-500 bg-red-950/80 text-red-300' : '',
          toast.type === 'info' ? 'border-cyan-500 bg-cyan-950/80 text-cyan-300' : '',
        ]"
      >
        <span class="text-lg">
          <template v-if="toast.type === 'success'">&#10003;</template>
          <template v-else-if="toast.type === 'error'">&#10007;</template>
          <template v-else>&#9432;</template>
        </span>
        <span>{{ toast.message }}</span>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { useToast } from '../composables/useToast'

const { toasts } = useToast()
</script>

<style scoped>
.toast-enter-active {
  transition: all 0.3s ease-out;
}
.toast-leave-active {
  transition: all 0.3s ease-in;
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(80px);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(80px);
}
.toast-move {
  transition: transform 0.3s ease;
}
</style>
