document.getElementById('petRegisterForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const name = document.getElementById('petName').value;
    const bio = document.getElementById('petBio').value;

    try {
        //Busca a imagem na dog api
        const dogApiResponse = await fetch('https://dog.ceo/api/breeds/image/random');
        const dogData = await dogApiResponse.json();
        const avatarUrl = dogData.message;

        const newPet = {
            name: name,
            bio: bio,
            avatarUrl: avatarUrl
        };

        const createdPet = await api.pets.create(newPet);
        alert(`Pet ${createdPet.name} cadastrado com sucesso!`);

        localStorage.setItem('loggedPetId', createdPet.id);
        window.location.href = 'profile.html';
    } catch (error){
        console.error('Erro ao cadastrar o pet:', error);
        alert('Ocorreu um erro ao criar o perfil. Verifique o console.');
    }
});