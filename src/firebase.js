import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getAnalytics } from 'firebase/analytics'

const firebaseConfig = {
  apiKey: "AIzaSyCOt5tcXp789xSkmKBad8_p6Y7a7G9qEHA",
  authDomain: "devtoolbox-39bfe.firebaseapp.com",
  projectId: "devtoolbox-39bfe",
  storageBucket: "devtoolbox-39bfe.firebasestorage.app",
  messagingSenderId: "504487932295",
  appId: "1:504487932295:web:95f0795340c4816075e322",
  measurementId: "G-RDK15JMSPT"
}

const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)
const auth = getAuth(app)
const db = getFirestore(app)
const googleProvider = new GoogleAuthProvider()

export { auth, db, googleProvider, analytics }
