import firebase from 'firebase';

const firebaseConfig = {
  apiKey: 'AIzaSyAtZPARZMmEnZld1XSmnWusKLvQaMRwZp8',
  authDomain: 'onlychat2-9b930.firebaseapp.com',
  databaseURL: 'https://onlychat2-9b930.firebaseio.com',
  projectId: 'onlychat2-9b930',
  storageBucket: '',
  messagingSenderId: '142772286904',
  appId: '1:142772286904:web:49fd2aa4625706c5600b4d',
  measurementId: 'G-31RHR9XXR6',
};

// Initialize Firebase
let app = null;
if (!firebase.apps.length) {
  app = firebase.initializeApp(firebaseConfig);
}

export const Db = app.database();
export const Auth = app.auth();
export const Fbs = firebase;
