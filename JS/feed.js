// js/feed.js

const token = localStorage.getItem('authToken');
const myPetId = localStorage.getItem('loggedPetId');

// Proteção de rota: se não estiver logado, chuta pro index
if (!token || !myPetId) {
    window.location.href = 'index.html';
}

const linkMyProfile = document.getElementById('linkMyProfile');
const btnLogoutFeed = document.getElementById('btnLogoutFeed');
const feedContainer = document.getElementById('globalMessagesContainer');

// Configura o link para o próprio perfil
linkMyProfile.href = `profile.html?id=${myPetId}`;

// Lógica de Sair
btnLogoutFeed.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('authToken');
    localStorage.removeItem('loggedPetId');
    window.location.href = 'index.html';
});

// Carrega o feed global
async function loadGlobalFeed() {
    try {
        const messages = await api.messages.getAll();

        feedContainer.innerHTML = ''; // Limpa o "Carregando..."

        if (messages.length === 0) {
            feedContainer.innerHTML = "<p>A vizinhança está muito silenciosa hoje.</p>";
            return;
        }

        messages.forEach(msg => {
            const card = document.createElement('div');
            card.className = 'feed-card';
            
            card.innerHTML = `
                <div class="feed-header">
                    Data: ${new Date(msg.created_at).toLocaleString()} <br>
                    Mural de destino: <a href="profile.html?id=${msg.pet_id}">Ver Perfil</a>
                </div>
                <p><strong>Recado:</strong> "${msg.content}"</p>
                <div style="margin-top: 10px; font-size: 0.9em;">
                    <a href="scrapbook.html?petId=${msg.pet_id}">Ir para este Scrapbook ➔</a>
                </div>
            `;
            
            feedContainer.appendChild(card);
        });

    } catch (error) {
        console.error('Erro ao carregar o feed:', error);
        feedContainer.innerHTML = "<p>Erro ao farejar os recados do servidor.</p>";
    }
}

loadGlobalFeed();