const currentPetId = localStorage.getItem('loggedPetId');

if (!currentPetId) {
    window.location.href = 'index.html';
}

const linkBackToProfile = document.getElementById('linkBackToProfile');
const scrapbookForm = document.getElementById('scrapbookForm');
const messageContentInput = document.getElementById('messageContent');
const messageContainer = document.getElementById('messagesContainer');

if (currentPetId){
    linkBackToProfile.href = `profile.html?id=${currentPetId}`;

}

//Carrega lista de recado
async function LoadMessages() {
    if(!currentPetId) {
        messageContainer.innerHTML = "<p>Erro: Pet não identificado na URL.</p>";
        return;
    }

    try {
        const messages = await api.messages.getAll(currentPetId);

        messageContainer.innerHTML = '';

        if(messages.length === 0){
            messagesContainer.innerHTML = "<p>Nenhum recado ainda. Seja o primeiro a latir!</p><";
            return;
        }

        messages.forEach(msg => renderMessageCard(msg));
        
    } catch (error){
        console.error('Erro ao carregar mensagens', error);
        messageContainer.innerHTML = "<p>Erro ao buscar os recados no servidor.</p>";
    }
    
}

function renderMessageCard(msg){
    const card = document.createElement('div');
    card.className = 'message-card normal-mode';
    card.id = `message-${msg.id}`;

    card.innerHTML = `
        <div class="timestamp">${new Date(msg.timestamp).toLocaleString()}</div>
        
        <!-- Modo de visualização -->
        <p class="display-text">${msg.content}</p>
        
        <!-- Modo de edição (oculto por padrão via CSS) -->
        <textarea class="edit-input" rows="2">${msg.content}</textarea>
        
        <div class="actions">
            <button class="btn-edit-start">Editar</button>
            <button class="btn-edit-save" style="display:none;">Salvar</button>
            <button class="btn-edit-cancel" style="display:none;">Cancelar</button>
            <button class="btn-delete">Apagar</button>
        </div>

    `;

    //Lógica de edição
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
        if(!newContent) return alert('O recado não pode ficar vazio.');

        try{
            const updateMsg = await api.messages.update(msg.id, newContent);

            displayText.textContent = updateMsg.content;
            editInput.value = updateMsg.content;

            card.classList.replace('edit-mode', 'normal-mode');
            resetButtons();
        } catch (error){
            console.error('Erro ao atualizar mensagem:', error);
            alert('Erro ao salvar edição no servidor.');
        }
    });

    //Lógica de deletar
    btnDelete.addEventListener('click', async () => {
        if (confirm('Tem certeza que deseja apagar este recado?')){
            try {
                await api.messages.delete(msg.id);
                card.remove();
            } catch (error){
                console.error('Erro ao apagar mensagem:', error);
                alert('Erro ao apagar no servidor.');
            }
        }
    });

    function resetButtons(){
        btnEditStart.style.display = 'inline-block';
        btnDelete.style.display = 'inline-block';
        btnEditSave.style.display = 'none';
        btnEditCancel.style.display = 'none';
    }

    messageContainer.prepend(card);
}

//Envio de novo recado.
scrapbookForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    if(!currentPetId) return alert('Erro: ID do pet desconhecido.');

    const newContent = messageContentInput.value.trim();

    try{
        const payload = {
            petId: currentPetId,
            content: newContent
        };

        const createdMessage = await api.messages.create(payload);
        if (messagesContainer.innerHTML.includes("Nenhum recado ainda")){
            messageContainer.innerHTML = '';
        }

        renderMessageCard(createdMessage);
        messageContentInput.value = '';
    } catch (error){
        console.error('Erro ao criar mensagem:',error);
        alert('Erro ao enviar recado ao servidor.');
    }
});

LoadMessages();
