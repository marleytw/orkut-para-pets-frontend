
const loggedPetId = localStorage.getItem('loggedPetId');

// 2. De quem é este perfil? (Tenta pegar da URL, se não tiver, é o meu)
const urlParams = new URLSearchParams(window.location.search);
const viewedPetId = urlParams.get('id') || loggedPetId; 

// Proteção de rota
if (!loggedPetId) {
    window.location.href = 'index.html';
}

//Informações da Tela
const petAvatarEl = document.getElementById('petAvatar');
const petNameEl = document.getElementById('petName');
const petBioEl = document.getElementById('petBio');
const linkScrapbook = document.getElementById('linkScrapbook');

//Botões
const btnEditProfile = document.getElementById('btnEditProfile');
const btnDeleteProfile = document.getElementById('btnDeleteProfile');
const btnLogout = document.getElementById('btnLogout'); 

//Modal
const editModal = document.getElementById('editProfileModal');
const editForm = document.getElementById('editProfileForm');
const editNameInput = document.getElementById('editPetName');
const editBioInput = document.getElementById('editPetBio');

const isOwner = (loggedPetId === viewedPetId);

// Carrega os dados
async function loadProfile() {
    try {
        const petData = await api.pets.getById(viewedPetId);
        
        petNameEl.textContent = petData.name;
        petBioEl.textContent = petData.bio;
        petAvatarEl.src = petData.avatar_url; 
        petAvatarEl.style.display = 'block';

        // Aponta para o mural correto
        linkScrapbook.href = `scrapbook.html?petId=${viewedPetId}`;

        
        if (isOwner) {
            linkScrapbook.textContent = "Ver meu Mural de Recados";
            if (btnEditProfile) btnEditProfile.style.display = 'inline-block';
            if (btnDeleteProfile) btnDeleteProfile.style.display = 'inline-block';
        } else {
            linkScrapbook.textContent = `Ver Mural de ${petData.name}`;
            if (btnEditProfile) btnEditProfile.style.display = 'none';
            if (btnDeleteProfile) btnDeleteProfile.style.display = 'none';
            if (btnLogout) btnLogout.style.display = 'none'; 
        }

    } catch(error) {
        console.error('Erro ao carregar o perfil:', error);
        petNameEl.textContent = "Erro: Pet não encontrado. Ele pode ter fugido.";
        petBioEl.textContent = "";
        
        if (btnEditProfile) btnEditProfile.style.display = 'none';
        if (btnDeleteProfile) btnDeleteProfile.style.display = 'none';
    }
}

if (btnEditProfile) {
    btnEditProfile.addEventListener('click', () => {
        editNameInput.value = petNameEl.textContent;
        editBioInput.value = petBioEl.textContent;
        editModal.showModal();
    });
}

document.getElementById('btnCancelEdit').addEventListener('click', () => {
    editModal.close();
});

editForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const updatedData = {
        name: editNameInput.value,
        bio: editBioInput.value
    };

    try {
        const result = await api.pets.update(viewedPetId, updatedData);
        petNameEl.textContent = result.name;
        petBioEl.textContent = result.bio;
        alert("Perfil atualizado com sucesso!");
        editModal.close();
    } catch (error) {
        console.error('Erro ao atualizar perfil:', error);
        alert('Erro ao salvar as alterações do servidor.');
    }
});

if (btnDeleteProfile) {
    btnDeleteProfile.addEventListener('click', async () => {
        const confirmDelete = confirm("Tem certeza que deseja excluir sua conta? Esta ação não poderá ser desfeita.");
        if (confirmDelete) {
            try {
                await api.pets.delete(viewedPetId);
                alert("Conta excluída com sucesso. Voltando para tela inicial...");
                localStorage.removeItem('loggedPetId');
                localStorage.removeItem('authToken');
                window.location.href = 'index.html';
            } catch (error) {
                console.error('Erro ao excluir conta:', error);
                alert('Erro ao tentar excluir a conta no servidor.');
            }
        }
    });
}

if (btnLogout) {
    btnLogout.addEventListener('click', () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('loggedPetId');
        window.location.href = 'index.html';
    });
}

loadProfile();