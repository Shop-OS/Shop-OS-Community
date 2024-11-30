import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyBRwM8lUOavSS86bOUK3gL8YDjNcks4Ajg',
  appId: '1:1044012110873:web:4abc228edc9d5accf34688',
  authDomain: 'ai-ad-62300.firebaseapp.com',
  messagingSenderId: '1044012110873',
  projectId: 'ai-ad-62300',
  storageBucket: 'ai-ad-62300.appspot.com',
};

const app = initializeApp(firebaseConfig);

const storage = getStorage(app);

export { app, storage };
