const BASE_URL = 'http://localhost:3000/api';

const headers = {
    'Content-Type': 'application/json'
}

const api = {
    pets: {
        create: async (petData) => {
            const response = await fetch(`${BASE_URL}/pets`, {
                method: 'POST',
                headers,
                body: JSON.stringify(petData)
            });
            return response.json();
        },
        getById: async (id) => {
            const response = await fetch(`${BASE_URL}/pets/${id}`);
            return response.json();
        },
        update: async (id, petData) => {
            const response = await fetch(`${BASE_URL}/pets/${id}`, {
                method: 'PUT',
                headers,
                body: JSON.stringify(petData)
            });
            return response.json();
        },
        delete: async (id) => {
            const response = await fetch(`${BASE_URL}/pets/${id}`, {
                method: 'DELETE'
            });
            return response;
        }
    },

    messages: {
        create: async (messageData) => {
            const response = await fetch(`${BASE_URL}/messages`,  {
                method: 'POST',
                headers,
                body: JSON.stringify(messageData)
            });
            return response.json();
        },
        getAll: async (petId = null) => {
            const url = petId ? `${BASE_URL}/messages?petId=${$petId}` : `${BASE_URL}/messages`;
            const response = await fetch(url);
            return response.json;
        },
        update: async (id, content) => {
            const response = await fetch(`${BASE_URL}/messages/${id}`, {
                method: 'PUT',
                headers,
                body: JSON.stringify({content})
            });
            return response.json();
        },
        delete: async (id) => {
            const response = await fetch(`${BASE_URL}/messages/${id}`, {
                method: 'DELETE'
            });
            return response;
        }
    }
}