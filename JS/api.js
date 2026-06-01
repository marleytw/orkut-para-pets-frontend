const BASE_URL = 'http://localhost:3000/api';


function getHeaders(){
    const token = localStorage.getItem('authToken');
    const headers = {'Content-Type': 'application/json'};
    if (token){
        headers['Authorization'] = `Bearer ${token}`
    }

    return headers;
}


const api = {
    auth:{
        login: async (credentials) => {
            const response = await fetch(`${BASE_URL}/auth/login`,{
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(credentials)
            });
            if(!response.ok) throw await response.json();
            return response.json();
        }
    },
    
    pets: {
        create: async (petData) => {
            const response = await fetch(`${BASE_URL}/pets`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(petData)
            });
            if(!response.ok) throw await response.json();
            return response.json();
        },
        getById: async (id) => {
            const response = await fetch(`${BASE_URL}/pets/${id}`);
            if(!response.ok) throw await response.json();
            return response.json();
        },
        update: async (id, petData) => {
            const response = await fetch(`${BASE_URL}/pets/${id}`, {
                method: 'PUT',
                headers: getHeaders(),
                body: JSON.stringify(petData)
            });
            if(!response.ok) throw await response.json();
            return response.json();
        },
        delete: async (id) => {
            const response = await fetch(`${BASE_URL}/pets/${id}`, {
                method: 'DELETE',
                headers: getHeaders()
            });
            if (!response.ok) throw await response.json();
            return response;
        }
    },

    messages: {
        create: async (messageData) => {
            const response = await fetch(`${BASE_URL}/messages`,  {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify(messageData)
            });
            if (!response.ok) throw await response.json();
            return response.json();
        },
        getAll: async (petId = null) => {
            const url = petId ? `${BASE_URL}/messages?petId=${petId}` : `${BASE_URL}/messages`;
            const response = await fetch(url, {
                method: 'GET',
                headers: getHeaders()
            });
            if (!response.ok) throw await response.json();
            return response.json();
        },
        update: async (id, content) => {
            const response = await fetch(`${BASE_URL}/messages/${id}`, {
                method: 'PUT',
                headers: getHeaders(),
                body: JSON.stringify({content})
            });
            if (!response.ok) throw await response.json();
            return response.json();
        },
        delete: async (id) => {
            const response = await fetch(`${BASE_URL}/messages/${id}`, {
                method: 'DELETE',
                headers: getHeaders()
            });
            if (!response.ok) throw await response.json();
            return response;
        }
    }
};