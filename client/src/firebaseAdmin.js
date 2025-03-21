const admin = require("firebase-admin");

const serviceAccount = require("./path-to-your-firebase-adminsdk.json"); // Update with your actual file path

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const messaging = admin.messaging();

module.exports = messaging;
