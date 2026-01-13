// using native fetch

// Using fetch since it is built-in in newer Node versions
const BASE_URL = 'http://localhost:5000/api/auth';

const login = async () => {
    try {
        console.log('--- Testing Login ---');
        const response = await fetch(`${BASE_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'admin@example.com',
                password: 'password123'
            })
        });

        const data = await response.json();
        console.log('Status:', response.status);
        if (response.ok) {
            console.log('Login Successful');
            console.log('Token:', data.accessToken ? 'Present' : 'Missing');
            return data.accessToken;
        } else {
            console.log('Login Failed:', data);
            return null;
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
};

const getMe = async (token) => {
    try {
        console.log('\n--- Testing Protected Route (/me) ---');
        const response = await fetch(`${BASE_URL}/me`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();
        console.log('Status:', response.status);
        if (response.ok) {
            console.log('User:', data.email);
            console.log('Role:', data.roles[0].role_name);
        } else {
            console.log('Access Failed:', data);
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
};

const run = async () => {
    // Wait a bit for server to be ready if running simultaneously, 
    // but here we assume server will be started separately.
    const token = await login();
    if (token) {
        await getMe(token);
    }
};

run();
