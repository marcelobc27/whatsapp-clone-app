import { initializeApp } from "firebase/app";
// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

export const getFirebaseApp = () => {
  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyC1lAkYuY2Pxo3Y1unY57lcvC6Mieu0xT4",
    authDomain: "whatsapp-42161.firebaseapp.com",
    projectId: "whatsapp-42161",
    storageBucket: "whatsapp-42161.appspot.com",
    messagingSenderId: "335377530314",
    appId: "1:335377530314:web:05fea5351b766fa95ee333",
  };

  // Initialize Firebase
  return initializeApp(firebaseConfig);
};
