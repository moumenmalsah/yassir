import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, signInAnonymously, signInWithCustomToken } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

const getFirebaseConfig = () => {
  try {
    const config = typeof window !== 'undefined' ? window.__firebase_config : undefined;
    if (config) {
      return typeof config === 'string' ? JSON.parse(config) : config;
    }
  } catch (e) {
    console.error("Error parsing firebase config", e);
  }
  return null;
};

const firebaseConfig = getFirebaseConfig();
export const APP_ID = (typeof window !== 'undefined' && window.__app_id) ? window.__app_id : 'hassi-berkane-v1';

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;

if (firebaseConfig && firebaseConfig.apiKey) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (e) {
    console.error("Firebase init error", e);
  }
}

export const firebaseServices = {
  app,
  auth,
  db,
  isAvailable: !!(app && auth && db)
};

export const initAuth = async () => {
  if (!firebaseServices.auth) return;
  try {
    const token = typeof window !== 'undefined' ? window.__initial_auth_token : undefined;
    if (token) await signInWithCustomToken(firebaseServices.auth, token);
    else await signInAnonymously(firebaseServices.auth);
  } catch (err) {
    console.warn("Auth failed, falling back to local mode", err);
    firebaseServices.isAvailable = false;
  }
};