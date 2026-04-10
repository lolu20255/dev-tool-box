import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from './stores/auth'
import JsonDiff from './components/JsonDiff.vue'
import TradingProfit from './components/TradingProfit.vue'
import MarkdownPreview from './components/MarkdownPreview.vue'
import AppCheckmarks from './components/AppCheckmarks.vue'

const ALLOWED_EMAIL = 'mdiaz00147@gmail.com'

const routes = [
  { path: '/', redirect: '/json-diff' },
  { path: '/json-diff', name: 'json-diff', component: JsonDiff },
  {
    path: '/trading-profit',
    name: 'trading-profit',
    component: TradingProfit,
    meta: { allowedEmail: ALLOWED_EMAIL },
  },
  { path: '/md-preview', name: 'md-preview', component: MarkdownPreview },
  { path: '/app-checkmarks', name: 'app-checkmarks', component: AppCheckmarks },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to) => {
  if (!to.meta.allowedEmail) return true

  const authStore = useAuthStore()
  await authStore.ready

  if (authStore.user?.email === to.meta.allowedEmail) return true

  return { name: 'json-diff' }
})

export { ALLOWED_EMAIL }
export default router
