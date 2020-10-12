// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/7.15.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.15.0/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
  apiKey: "AIzaSyCz1m3SvBz1OpVWLFWX-FL-SCY_8HbgxEE",
  authDomain: "f2020.bregnvig.dk",
  databaseURL: "https://f1-2020-9dec0.firebaseio.com",
  projectId: "f1-2020-9dec0",
  storageBucket: "f1-2020-9dec0.appspot.com",
  messagingSenderId: "209105975677",
  appId: "1:209105975677:web:a18d0a67d142e0e85f3414",
  measurementId: "G-BRDT1FLJ41"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

