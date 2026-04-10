import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile
} from 'firebase/auth'
import { auth, googleProvider } from '../firebase'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const loading = ref(true)
  const error = ref(null)
  let _readyResolve
  const ready = new Promise(resolve => { _readyResolve = resolve })

  function init() {
    onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        user.value = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL
        }
      } else {
        user.value = null
      }
      loading.value = false
      _readyResolve()
    })
  }

  async function login(email, password) {
    error.value = null
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (e) {
      error.value = formatError(e.code)
      throw e
    }
  }

  async function register(email, password, displayName) {
    error.value = null
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password)
      if (displayName) {
        await updateProfile(cred.user, { displayName })
        user.value = { ...user.value, displayName }
      }
    } catch (e) {
      error.value = formatError(e.code)
      throw e
    }
  }

  async function loginWithGoogle() {
    error.value = null
    try {
      await signInWithPopup(auth, googleProvider)
    } catch (e) {
      if (e.code !== 'auth/popup-closed-by-user') {
        error.value = formatError(e.code)
      }
      throw e
    }
  }

  async function logout() {
    await signOut(auth)
  }

  function formatError(code) {
    const map = {
      'auth/email-already-in-use': 'Email is already registered',
      'auth/invalid-email': 'Invalid email address',
      'auth/weak-password': 'Password must be at least 6 characters',
      'auth/user-not-found': 'No account found with this email',
      'auth/wrong-password': 'Incorrect password',
      'auth/invalid-credential': 'Invalid email or password',
      'auth/too-many-requests': 'Too many attempts. Try again later',
    }
    return map[code] || 'An error occurred. Please try again'
  }

  return { user, loading, error, ready, init, login, register, loginWithGoogle, logout }
})
