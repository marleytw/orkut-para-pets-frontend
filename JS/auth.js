document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await api.auth.login({email, password});

        localStorage.setItem('authToken', response.token);
        localStorage.setItem('loggedPetId', response.pet.id);

        window.location.href = 'feed.html';
    } catch (error){
        console.error('Erro no login:', error);
        alert(error.error || 'Erro ao fazer login. Verifique suas credenciais');
    }
});

document.getElementById('petRegisterForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const name = document.getElementById('petName').value;
    const email = document.getElementById('petEmail').value;
    const password = document.getElementById('petPassword').value;
    const bio = document.getElementById('petBio').value;

    try{
        let avatarUrl = '';
        try{
            const dogApiResponse = await fetch('https://dog.ceo/api/breeds/image/random');
            const dogData = await dogApiResponse.json();
            avatarUrl = dogData.message;

        } catch (imgError){
            console.warn('Dog API fslhou, cadastrando sem avatar', imgError);
        }

        const newPet = {
            name,
            email,
            password,
            bio,
            avatar_url: avatarUrl
        };

        await api.pets.create(newPet);

        alert(`Conta criada com sucesso! Você já pode fazer o login ao lado.`);

        document.getElementById('petRegisterForm').reset();
        document.getElementById('loginEmail').value = email;
    } catch (error){
        console.error('Erro ao cadastrar o pert:', error);
        if(error.errors){
            alert('Erro de validação: Verifique os campos.');
        } else {
            alert(error.error || 'Ocorreu um erro ao criar o perfil.');
        }
    }
});

if(localStorage.getItem('authToken')){
    window.location.href = 'feed.html';
}