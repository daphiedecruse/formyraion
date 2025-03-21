import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
    apiKey: "AIzaSyCXOVy3gIQPDDA5GUm0JoWA8qW9uP20oTk",
    authDomain: "for-my-raion.firebaseapp.com",
    projectId: "for-my-raion",
    storageBucket: "for-my-raion.firebasestorage.app",
    messagingSenderId: "768624179893",
    appId: "1:768624179893:web:71cfd3a57bb47325e79cfc",
    measurementId: "G-X9FR8GMJH4"
  };

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// Request permission for notifications
export const requestPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const token = await getToken(messaging, {
        vapidKey: "YOUR_VAPID_KEY",
      });
      console.log("FCM Token:", token);
      return token;
    } else {
      console.log("Permission denied");
    }
  } catch (error) {
    console.error("Error getting permission:", error);
  }
};

// Listen for messages
onMessage(messaging, (payload) => {
  console.log("Message received:", payload);
});

export default app;
