async function getUsers() {
    try {
        const response = await fetch('http://localhost:3000/api/users');
        const users = await response.json();
        return users;
    } catch (error) {
        console.error('Error:', error);
    }
}

async function createUser(userData) {
    try {
        const response = await fetch('http://localhost:3000/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        });
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
    }
}