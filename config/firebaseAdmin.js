const admin = require('firebase-admin');

// Initialize Firebase Admin SDK using one of these options:
// - FIREBASE_SERVICE_ACCOUNT (JSON stringified service account) OR
// - FIREBASE_SERVICE_ACCOUNT_PATH (path to JSON file) OR
// - GOOGLE_APPLICATION_CREDENTIALS env var (standard Google SDK behavior)
if (!admin.apps.length) {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
  } else if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
    const serviceAccount = require(process.env.FIREBASE_SERVICE_ACCOUNT_PATH);
    admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
  } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    admin.initializeApp();
  } else {
    // Do not throw in development where you might want to run without admin
    // but signal clearly.
    console.warn('Firebase Admin not initialized: set FIREBASE_SERVICE_ACCOUNT or FIREBASE_SERVICE_ACCOUNT_PATH or GOOGLE_APPLICATION_CREDENTIALS');
  }
}

module.exports = admin;
