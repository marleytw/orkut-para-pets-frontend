const currentPetId = localStorage.getItem('loggedPetId');

//DOM
const petAvatarEl = document.getElementById('petAvatar');
const petNameEl = document.getElementById('petName');
const petBioEl = document.getElementById('petBio');
const linkScrapbook = document.getElementById('linkScrapbook');

//MODAL
const editModal = document.getElementById('editProfileModal');
const editForm = document.getElementById('editProfileForm');
const editNameInput = document.getElementById('editPetName');
const editBioInput = document.getElementById('editPetBio');

//Dados do perfil
async function loadProfile() {
    if(!currentPetId){
        alert("AVISO: Nenhum ID de pet encontrado.");
        petNameEl.textContent = "Erro: Pet não identificado.";
        petBioEl.textContent = "";
        window.location.href = 'index.html';
        return;
    }

    try {
        const petData = await api.pets.getById(currentPetId);
        //Renderiza no HTML
        petNameEl.textContent = petData.name;
        petBioEl.textContent = petData.bio;

        petAvatarEl.src = petData.avatar_url;
        petAvatarEl.style.display = 'block';

        linkScrapbook.href = `scrapbook.html?petId=${currentPetId}`;

    } catch(error){
        console.error('Erro ao carregar o perfil:', error);
        petNameEl.textContent = "Erro ao carregar perfil do servidor.";
        petBioEl.textContent = "";
    }
    
}
//Abre modal e salva edições
document.getElementById('btnEditProfile').addEventListener('click', () => {
    editNameInput.value = petNameEl.textContent;
    editBioInput.value = petBioEl.textContent;

    editModal.showModal();
});

document.getElementById('btnCancelEdit').addEventListener('click', () => {
    editModal.close();
});

editForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const updatedData = {
        name: editNameInput.value,
        bio: editBioInput.value
    };

    try{
        const result = await api.pets.update(currentPetId, updatedData);

        //Atualiza a tela
        petNameEl.textContent = result.name;
        petBioEl.textContent = result.bio;

        alert("Perfil atualizado com sucesso!");
        editModal.close();
    } catch (error){
        console.error('Erro ao atualizar perfil:', error);
        alert('Erro ao salvar as alterações do servidor.');
    }
});

document.getElementById('btnDeleteProfile').addEventListener('click', async () => {
    const confirmDelete = confirm("Tem certeza que deseja excluir sua conta? Esta ação não poderá ser desfeita e perderá todos seus chinelos mordidos.");

    if(confirmDelete){
        try{
            await api.pets.delete(currentPetId);
            alert("Conta excluida com sucesso. Voltado para tela inicial...");

            localStorage.removeItem('loggedPetId');
            localStorage.removeItem('authToken');
            window.location.href = 'index.html';
        } catch (error){
            console.error('Erro ao excluir conta:',error);
            alert('Erro ao tentar excluir a conta no servidor.');
        }
    }
});

loadProfile();