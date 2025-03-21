const admin = require('firebase-admin');
const serviceAccount = require('./firebaseServiceAccount.json');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: "for-my-raion.firebasestorage.app", // Make sure this is correct
    });
}

const bucket = admin.storage().bucket(); // Correct way to initialize bucket

module.exports = { admin, bucket };
