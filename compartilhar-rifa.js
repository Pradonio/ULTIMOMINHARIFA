import { getFirestore, doc, getDoc, updateDoc } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js';
import { app } from './firebase-config.js';

const db = getFirestore(app);

// Função para carregar os dados da rifa
async function loadRaffle() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const raffleId = urlParams.get('id'); // Obtém o ID da rifa
        if (!raffleId) {
            console.error('ID da rifa não fornecido na URL.');
            return;
        }

        const docRef = doc(db, 'rifas', raffleId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const { name, description, value, pixKey, quantity, reservedNumbers = {} } = docSnap.data();
            console.log('Dados da rifa:', { name, description, value, pixKey, quantity, reservedNumbers }); // Log dos dados

            document.getElementById('raffleName').innerText = name;
            document.getElementById('raffleDescription').innerText = description || 'Sem descrição';
            document.getElementById('raffleValue').innerText = `Valor do Número: R$ ${value ? value.toFixed(2) : 'Não informado'}`;

            // Verifica e exibe a chave Pix
            const pixKeyElement = document.getElementById('pixKey');
            if (pixKey && pixKey.trim() !== '') {
                pixKeyElement.innerText = `Chave Pix: ${pixKey}`;
            } else {
                pixKeyElement.innerText = 'Sem chave Pix';
            }

            // Carregar os números disponíveis e reservados
            loadNumbers(quantity, reservedNumbers);
        } else {
            console.error('Rifa não encontrada!');
        }
    } catch (error) {
        console.error('Erro ao carregar a rifa:', error);
    }
}

// Função para carregar os números e permitir reservas
function loadNumbers(quantity, reservedNumbers) {
    const numbersGrid = document.getElementById('numbersGrid');
    numbersGrid.innerHTML = ''; // Limpa a lista antes de adicionar novos números

    for (let i = 1; i <= quantity; i++) {
        const numberItem = document.createElement('li');
        numberItem.innerText = i;
        numberItem.classList.add('number-item');

        // Verifica se o número está reservado e aplica a classe apropriada
        if (reservedNumbers[i]) {
            const { name, approved } = reservedNumbers[i];
            numberItem.classList.add('reserved'); // Adiciona classe de reservado
            numberItem.style.backgroundColor = approved ? 'red' : 'orange'; // Muda a cor conforme o status
            numberItem.innerHTML += `<br>Reservado por: ${name}`; // Adiciona nome acima do número
        } else {
            numberItem.addEventListener('click', () => {
                document.getElementById('reservationForm').style.display = 'block';
                document.getElementById('reserveBtn').setAttribute('data-number', i); // Guarda o número a ser reservado
            });
        }

        numbersGrid.appendChild(numberItem); // Adiciona o número ao grid
    }
}

// Função para reservar o número
document.getElementById('reserveBtn').addEventListener('click', async () => {
    const userName = document.getElementById('userName').value;
    const userPhone = document.getElementById('userPhone').value;
    const numberToReserve = document.getElementById('reserveBtn').getAttribute('data-number');

    if (!userName) {
        alert('Por favor, insira seu nome.');
        return;
    }

    try {
        const urlParams = new URLSearchParams(window.location.search);
        const raffleId = urlParams.get('id');
        const docRef = doc(db, 'rifas', raffleId);
        const docSnap = await getDoc(docRef);

        // Verifica se o número já está reservado
        const reservedNumbers = docSnap.data().reservedNumbers || {};
        if (reservedNumbers[numberToReserve]) {
            alert('Esse número já está reservado!');
            return;
        }

        // Atualiza o número reservado no Firestore com nome e timestamp
        await updateDoc(docRef, {
            [`reservedNumbers.${numberToReserve}`]: {
                name: userName,
                phone: userPhone || 'Não informado',
                timestamp: new Date().toISOString()
            }
        });

        alert(`Número ${numberToReserve} reservado com sucesso!`);
        window.location.reload(); // Recarrega a página para atualizar os números
    } catch (error) {
        console.error('Erro ao reservar o número:', error);
    }
});

// Função para copiar o link da página para a área de transferência
document.getElementById('copyLinkBtn').addEventListener('click', () => {
    const link = window.location.href;
    navigator.clipboard.writeText(link).then(() => {
        alert('Link da página copiado para a área de transferência!');
    }).catch(err => {
        console.error('Erro ao copiar link da página:', err);
    });
});

// Função para compartilhar a rifa no WhatsApp
document.getElementById('shareWhatsAppBtn').addEventListener('click', () => {
    const link = window.location.href;
    const raffleName = document.getElementById('raffleName').innerText;
    const message = `Confira a rifa "${raffleName}" e participe! ${link}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
});

// Função para exibir as instruções de uso
document.getElementById('howToUseBtn').addEventListener('click', () => {
    const instructions = document.getElementById('instructions');
    instructions.style.display = instructions.style.display === 'none' ? 'block' : 'none';
});

// Carregar os dados da rifa quando a página é carregada
window.onload = loadRaffle;
