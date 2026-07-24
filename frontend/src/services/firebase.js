import { initializeApp, getApps } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  signInWithPopup, 
  GoogleAuthProvider,
  onAuthStateChanged
} from 'firebase/auth';

// Firebase configuration template.
// To use real Firebase, create a .env file in the frontend folder with these keys:
// VITE_FIREBASE_API_KEY=...
// VITE_FIREBASE_AUTH_DOMAIN=...
// VITE_FIREBASE_PROJECT_ID=...
// VITE_FIREBASE_STORAGE_BUCKET=...
// VITE_FIREBASE_MESSAGING_SENDER_ID=...
// VITE_FIREBASE_APP_ID=...

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || ""
};

let auth;
let isMock = false;

// If API key is missing, fall back to mock auth
if (!firebaseConfig.apiKey || firebaseConfig.apiKey === "your_api_key") {
  console.warn("⚠️ WARNING: Frontend Firebase API Key is not configured. Running in Mock Auth mode.");
  isMock = true;
} else {
  try {
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    auth = getAuth(app);
  } catch (error) {
    console.error("Failed to initialize Firebase SDK, falling back to mock auth:", error);
    isMock = true;
  }
}

// Mock implementation of Firebase Auth for development
const mockAuth = {
  currentUser: null,
  listeners: [],
  
  onAuthStateChanged: (callback) => {
    // Read from localStorage to persist session
    const storedUser = localStorage.getItem('aspireya_mock_user');
    if (storedUser) {
      mockAuth.currentUser = JSON.parse(storedUser);
    } else {
      mockAuth.currentUser = null;
    }
    
    callback(mockAuth.currentUser);
    mockAuth.listeners.push(callback);
    
    // Return unsubscribe function
    return () => {
      mockAuth.listeners = mockAuth.listeners.filter(l => l !== callback);
    };
  },
  
  triggerListeners: () => {
    mockAuth.listeners.forEach(callback => callback(mockAuth.currentUser));
  }
};

export const clientAuth = isMock ? mockAuth : auth;
export const authIsMock = isMock;

// Wrap functions so they support both real firebase and mock firebase
export const loginWithEmail = async (email, password) => {
  if (isMock) {
    const user = {
      uid: 'mock-uid-123',
      email: email,
      displayName: email.split('@')[0],
      getIdToken: async () => 'mock-user-token'
    };
    mockAuth.currentUser = user;
    localStorage.setItem('aspireya_mock_user', JSON.stringify(user));
    mockAuth.triggerListeners();
    return { user };
  }
  return signInWithEmailAndPassword(auth, email, password);
};

export const signupWithEmail = async (email, password, displayName) => {
  if (isMock) {
    const user = {
      uid: 'mock-uid-123',
      email: email,
      displayName: displayName || email.split('@')[0],
      getIdToken: async () => 'mock-user-token'
    };
    mockAuth.currentUser = user;
    localStorage.setItem('aspireya_mock_user', JSON.stringify(user));
    mockAuth.triggerListeners();
    return { user };
  }
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  // Real firebase auth requires updates profile separate, we will let it return
  return credential;
};

export const logoutUser = async () => {
  if (isMock) {
    mockAuth.currentUser = null;
    localStorage.removeItem('aspireya_mock_user');
    mockAuth.triggerListeners();
    return;
  }
  return signOut(auth);
};

export const loginWithGoogle = async () => {
  if (isMock) {
    const user = {
      uid: 'mock-uid-123',
      email: 'googleuser@aspireya.com',
      displayName: 'Google Explorer',
      getIdToken: async () => 'mock-user-token'
    };
    mockAuth.currentUser = user;
    localStorage.setItem('aspireya_mock_user', JSON.stringify(user));
    mockAuth.triggerListeners();
    return { user };
  }
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
};
