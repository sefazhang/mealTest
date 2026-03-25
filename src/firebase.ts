import { initializeApp } from "firebase/app"
import { getDatabase } from "firebase/database"

const firebaseConfig = {
  apiKey: "AIzaSyA8Ov-h5DqAXPpmPFyHowj0FtHsrG6m_ow",
  authDomain: "mymeal-5bc6d.firebaseapp.com",
  databaseURL: "https://mymeal-5bc6d-default-rtdb.firebaseio.com",
  projectId: "mymeal-5bc6d",
  storageBucket: "mymeal-5bc6d.firebasestorage.app",
  messagingSenderId: "564692151026",
  appId: "1:564692151026:web:2335b46903f88586cc7e6b"
}

const app = initializeApp(firebaseConfig)
export const db = getDatabase(app)