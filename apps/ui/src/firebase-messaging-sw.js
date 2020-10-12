// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/7.15.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.15.0/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
  apiKey: "AIzaSyDLsdZUiavtt8cS260ku3I-SnxD73V9xj0",
  authDomain: "fussball-dev.firebaseapp.com",
  databaseURL: "https://fussball-dev.firebaseio.com",
  projectId: "fussball-dev",
  storageBucket: "fussball-dev.appspot.com",
  messagingSenderId: "250704051094",
  appId: "1:250704051094:web:269b35fa702ba4b4d07bb7",
  measurementId: "G-PFNBC70XC6"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

