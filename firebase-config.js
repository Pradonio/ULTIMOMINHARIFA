// Importa as funções necessárias dos SDKs que você precisa
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-storage.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js"; // Importa a autenticação

// Configuração do seu aplicativo Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBKHGkoTYxNj-T344EvGRwvA3Rl4N-K6h0",
  authDomain: "ultimominharifa.firebaseapp.com",
  projectId: "ultimominharifa",
  storageBucket: "ultimominharifa.appspot.com",
  messagingSenderId: "491610660552",
  appId: "1:491610660552:web:e41468657780fc6edecffd"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);    // Inicializa o Firestore
const storage = getStorage(app); // Inicializa o Firebase Storage
const auth = getAuth(app);       // Inicializa a autenticação

// Exporta app, db, storage e auth para uso em outros módulos
export { app, db, storage, auth };
