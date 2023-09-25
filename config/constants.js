const constants = {
  name: "DeepNote",
  version: "1.0.0",
  description:
    "A simple note taking app built with Next.js and Firebase with the help of AI",
  collection: "notes",
  firebase: {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    firebaseAppId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  },
  openai: {
    key: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  },
};

export default constants;
