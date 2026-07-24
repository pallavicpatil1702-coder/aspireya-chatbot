import admin from 'firebase-admin';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

let db;
let auth;
let isMock = false;

const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
const hasServiceAccountFile = serviceAccountPath && fs.existsSync(serviceAccountPath);
const hasEnvConfig = process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY;
const hasAdc = !!process.env.GOOGLE_APPLICATION_CREDENTIALS || process.env.FIREBASE_USE_DEFAULT_CREDENTIALS === 'true';

const isFirebaseConfigured = hasServiceAccountFile || hasEnvConfig || hasAdc;

if (isFirebaseConfigured) {
  try {
    if (hasServiceAccountFile) {
      const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
      console.log('Firebase Admin initialized with service account certificate.');
    } else if (hasEnvConfig) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        })
      });
      console.log('Firebase Admin initialized with environment variables.');
    } else {
      admin.initializeApp();
      console.log('Firebase Admin initialized with application default credentials.');
    }
    
    db = admin.firestore();
    auth = admin.auth();
  } catch (error) {
    console.warn('⚠️ WARNING: Firebase Admin failed to initialize properly. Running in Mock Database/Auth mode for development.');
    console.warn(error.message);
    isMock = true;
  }
} else {
  console.log('ℹ️ Firebase is not configured. Running in Mock Database/Auth mode for local development.');
  isMock = true;
}

// Module-scoped, persistent in-memory database for local development
const inMemoryStore = {
  users: {
    'default-session': {
      displayName: 'Explorer',
      profile: {
        education: 'B.Tech Computer Science',
        stream: 'Engineering',
        interests: ['Artificial Intelligence', 'Software Development'],
        skills: ['JavaScript', 'Python', 'React'],
        goals: 'Become a Full Stack AI Engineer'
      }
    },
    'mock-uid-123': {
      displayName: 'Test Career Explorer',
      profile: {
        education: 'Class 12',
        stream: 'Science',
        interests: ['Astrophysics', 'Space Technology'],
        skills: ['Mathematics', 'Physics'],
        goals: 'Explore careers in space research'
      }
    }
  },
  chats: {}
};

// Custom Mock Implementations for Firestore and Auth
const mockDb = {
  collection: (collectionName) => {
    console.log(`[Mock DB] Accessing collection "${collectionName}"`);
    
    if (!inMemoryStore[collectionName]) {
      inMemoryStore[collectionName] = {};
    }
    const collectionStore = inMemoryStore[collectionName];
    
    return {
      doc: (docId) => {
        if (!docId) {
          docId = 'mock_' + Math.random().toString(36).substring(2, 11);
        }
        return {
          id: docId,
          get: async () => {
            const data = collectionStore[docId] || null;
            return {
              exists: !!data,
              data: () => data ? JSON.parse(JSON.stringify(data)) : null
            };
          },
          set: async (data, options) => {
            console.log(`[Mock DB] Doc "${docId}" in collection "${collectionName}" set to:`, data);
            if (options?.merge) {
              collectionStore[docId] = { ...(collectionStore[docId] || {}), ...data };
            } else {
              collectionStore[docId] = JSON.parse(JSON.stringify(data));
            }
            return { writeTime: new Date() };
          },
          update: async (data) => {
            console.log(`[Mock DB] Doc "${docId}" in collection "${collectionName}" updated with:`, data);
            collectionStore[docId] = { ...(collectionStore[docId] || {}), ...data };
            return { writeTime: new Date() };
          },
          collection: (subCollectionName) => {
             return mockDb.collection(`${collectionName}/${docId}/${subCollectionName}`);
          }
        };
      },
      where: (field, op, value) => {
        console.log(`[Mock DB] Querying collection "${collectionName}" where ${field} ${op} ${value}`);
        
        const executeQuery = async (limitNum, orderField, orderDir) => {
          let docs = [];
          for (const [id, data] of Object.entries(collectionStore)) {
            if (op === '==' && data[field] === value) {
              docs.push({
                id,
                data: () => JSON.parse(JSON.stringify(data)),
                exists: true,
                _raw: data
              });
            }
          }
          
          if (orderField) {
            docs.sort((a, b) => {
              const valA = a._raw[orderField];
              const valB = b._raw[orderField];
              if (valA < valB) return orderDir === 'desc' ? 1 : -1;
              if (valA > valB) return orderDir === 'desc' ? -1 : 1;
              return 0;
            });
          }
          
          if (limitNum) {
            docs = docs.slice(0, limitNum);
          }
          
          return {
            empty: docs.length === 0,
            docs
          };
        };

        return {
          get: () => executeQuery(null, null, null),
          limit: (n) => ({
            get: () => executeQuery(n, null, null)
          }),
          orderBy: (orderField, orderDir = 'asc') => ({
            get: () => executeQuery(null, orderField, orderDir),
            limit: (n) => ({
              get: () => executeQuery(n, orderField, orderDir)
            })
          })
        };
      },
      limit: (n) => {
        return {
          get: async () => {
            const docs = [];
            for (const [id, data] of Object.entries(collectionStore)) {
              docs.push({
                id,
                data: () => JSON.parse(JSON.stringify(data)),
                exists: true
              });
              if (docs.length >= n) break;
            }
            return {
              empty: docs.length === 0,
              docs
            };
          }
        };
      }
    };
  }
};

const mockAuth = {
  verifyIdToken: async (token) => {
    console.log(`[Mock Auth] Verifying ID token: ${token.substring(0, 10)}...`);
    if (token === 'mock-user-token' || token.startsWith('mock_')) {
      return {
        uid: 'mock-uid-123',
        email: 'testuser@aspireya.com',
        name: 'Test Career Explorer',
        email_verified: true
      };
    }
    throw new Error('Invalid mock token');
  }
};

export const firestoreDb = isMock ? mockDb : db;
export const firebaseAuth = isMock ? mockAuth : auth;
export const firebaseAdmin = admin;
export const firebaseIsMock = isMock;

