// js/scrapbook.js

// 1. Quem sou eu? (Pega do navegador)
const loggedPetId = localStorage.getItem('loggedPetId');

// 2. De quem é este mural? (Pega da URL ou assume que é meu)
const urlParams = new URLSearchParams(window.location.search);
const currentPetId = urlParams.get('petId') || loggedPetId;

// Proteção de rota
if (!loggedPetId || !currentPetId) {
    window.location.href = 'index.html';
}

// Lógica crucial: Sou o dono deste mural?
const isOwner = (loggedPetId === currentPetId);

// DOM
const linkBackToProfile = document.getElementById('linkBackToProfile');
const scrapbookForm = document.getElementById('scrapbookForm');
const messageContentInput = document.getElementById('messageContent');
const messagesContainer = document.getElementById('messagesContainer');

// O botão de voltar deve apontar para o dono do mural atual
linkBackToProfile.href = `profile.html?id=${currentPetId}`;

// 1. READ: Carregar a lista de recados
async function loadMessages() {
    try {
        const messages = await api.messages.getAll(currentPetId);
        
        messagesContainer.innerHTML = ''; 

        if (messages.length === 0) {
            messagesContainer.innerHTML = "<p>Nenhum recado ainda. Seja o primeiro a latir!</p>";
            return;
        }

        messages.forEach(msg => renderMessageCard(msg));

    } catch (error) {
        console.error('Erro ao carregar mensagens:', error);
        messagesContainer.innerHTML = "<p>Erro ao buscar os recados no servidor.</p>";
    }
}

// Função para criar a estrutura HTML de uma mensagem
function renderMessageCard(msg) {
    const card = document.createElement('div');
    card.className = 'message-card normal-mode';
    card.id = `message-${msg.id}`;

    // Prepara os botões de ação e input APENAS se for o dono do mural
    let actionsHtml = '';
    if (isOwner) {
        actionsHtml = `
            <textarea class="edit-input" rows="2">${msg.content}</textarea>
            <div class="actions" style="margin-top: 10px;">
                <button class="btn-edit-start">Editar</button>
                <button class="btn-edit-save" style="display:none;">Salvar</button>
                <button class="btn-edit-cancel" style="display:none;">Cancelar</button>
                <button class="btn-delete">Apagar</button>
            </div>
        `;
    }

    // Monta o card
    card.innerHTML = `
        <div class="timestamp">${new Date(msg.created_at).toLocaleString()}</div>
        <p class="display-text">${msg.content}</p>
        ${actionsHtml}
    `;

    // Se for o dono, adiciona os eventos de clique nos botões
    if (isOwner) {
        const btnEditStart = card.querySelector('.btn-edit-start');
        const btnEditSave = card.querySelector('.btn-edit-save');
        const btnEditCancel = card.querySelector('.btn-edit-cancel');
        const btnDelete = card.querySelector('.btn-delete');
        
        const displayText = card.querySelector('.display-text');
        const editInput = card.querySelector('.edit-input');

        btnEditStart.addEventListener('click', () => {
            card.classList.replace('normal-mode', 'edit-mode');
            btnEditStart.style.display = 'none';
            btnDelete.style.display = 'none';
            btnEditSave.style.display = 'inline-block';
            btnEditCancel.style.display = 'inline-block';
        });

        btnEditCancel.addEventListener('click', () => {
            card.classList.replace('edit-mode', 'normal-mode');
            editInput.value = displayText.textContent;
            resetButtons();
        });

        btnEditSave.addEventListener('click', async () => {
            const newContent = editInput.value.trim();
            if (!newContent) return alert('O recado não pode ficar vazio.');

            try {
                const updatedMsg = await api.messages.update(msg.id, newContent);
                displayText.textContent = updatedMsg.content;
                editInput.value = updatedMsg.content;
                card.classList.replace('edit-mode', 'normal-mode');
                resetButtons();
            } catch (error) {
                console.error('Erro ao atualizar mensagem:', error);
                alert('Erro ao salvar edição no servidor.');
            }
        });

        btnDelete.addEventListener('click', async () => {
            if (confirm('Tem certeza que deseja apagar este recado?')) {
                try {
                    await api.messages.delete(msg.id);
                    card.remove(); 
                } catch (error) {
                    console.error('Erro ao apagar mensagem:', error);
                    alert('Erro ao apagar no servidor.');
                }
            }
        });

        function resetButtons() {
            btnEditStart.style.display = 'inline-block';
            btnDelete.style.display = 'inline-block';
            btnEditSave.style.display = 'none';
            btnEditCancel.style.display = 'none';
        }
    }

    // Adiciona o card na tela
    messagesContainer.prepend(card);
}

// 4. CREATE: Enviar um novo recado (Qualquer um pode enviar)
scrapbookForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const newContent = messageContentInput.value.trim();
    if (!newContent) return;

    try {
        const payload = {
            pet_id: currentPetId,
            content: newContent
        };

        const createdMessage = await api.messages.create(payload);
        
        if (messagesContainer.innerHTML.includes("Nenhum recado ainda")) {
            messagesContainer.innerHTML = '';
        }

        renderMessageCard(createdMessage);
        messageContentInput.value = '';

    } catch (error) {
        console.error('Erro ao criar mensagem:', error);
        alert('Erro ao enviar recado ao servidor.');
    }
});

// Inicializa
loadMessages();