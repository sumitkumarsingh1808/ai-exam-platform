import admin from "firebase-admin";

const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
let privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;

if (privateKey) {
  // Handle escaped newlines properly from environment variables
  privateKey = privateKey.replace(/\\n/g, "\n");
}

export const isFirebaseAdminConfigured = Boolean(
  projectId && clientEmail && privateKey
);

export function getFirebaseAdmin() {
  if (!isFirebaseAdminConfigured) {
    return null;
  }

  if (admin.apps.length === 0) {
    try {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
    } catch (error) {
      console.warn("Failed to initialize Firebase Admin SDK:", error);
      return null;
    }
  }

  return {
    app: admin.app(),
    firestore: admin.firestore(),
    auth: admin.auth(),
  };
}
