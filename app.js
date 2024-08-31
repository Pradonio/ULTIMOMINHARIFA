import { auth, db } from './firebase-config.js'; // Certifique-se de que o firebase-config.js está configurado corretamente

// Função para mostrar a seção de cadastro e ocultar a de login
function showRegister() {
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('registerSection').style.display = 'block';
}

// Função para mostrar a seção de login e ocultar a de cadastro
function showLogin() {
    document.getElementById('registerSection').style.display = 'none';
    document.getElementById('loginSection').style.display = 'block';
}

// Adiciona ouvintes para os botões
document.getElementById('registerBtn').addEventListener('click', register);
document.getElementById('loginBtn').addEventListener('click', login);
document.getElementById('showRegister').addEventListener('click', showRegister);
document.getElementById('showLogin').addEventListener('click', showLogin);

// Função para registrar um novo usuário
function register() {
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const userId = userCredential.user.uid;
            // Cria uma entrada para o usuário no Firestore
            db.collection('users').doc(userId).set({
                email: email,
                rifas: [] // Inicia com uma lista vazia de rifas
            })
            .then(() => {
                alert('Usuário cadastrado com sucesso!');
                showLogin(); // Volta para a tela de login após o cadastro
            })
            .catch((error) => {
                alert('Erro ao criar entrada no Firestore: ' + error.message);
            });
        })
        .catch((error) => {
            if (error.code === 'auth/email-already-in-use') {
                alert('Este e-mail já está em uso. Tente com um e-mail diferente.');
            } else {
                alert('Erro ao cadastrar: ' + error.message);
            }
        });
}

// Função para login de usuário existente
function login() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            alert('Login realizado com sucesso!');
            // Redireciona o usuário para a página principal onde ele gerenciará suas rifas
            window.location.href = 'main.html';
        })
        .catch((error) => {
            if (error.code === 'auth/invalid-credential') {
                alert('Credenciais inválidas. Verifique seu e-mail e senha.');
            } else {
                alert('Erro ao fazer login: ' + error.message);
            }
        });
}
