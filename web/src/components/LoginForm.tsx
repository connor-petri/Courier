import React from 'react';
import { useState } from 'react';

interface LoginFormProps {
    onLoginSuccess: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }: LoginFormProps) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const serverAddress: URL = new URL('http://' + process.env.SERVER_IP + ':' + process.env.SERVER_PORT);
            const response: Response = await fetch(serverAddress + '/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({username, password})
            });

            if (!response.ok) {
                throw new Error('Login fialed. Please check your credentials');
            }

            const data = await response.json();
            console.log('Login successful:', data);
            onLoginSuccess(); // Call the success callback

        } catch (e: any) {
            console.error('Failed to login:', e);
            setError(e.message);
        }
    }
        
    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', maxWidth: '300px', margin: 'auto' }}>
            <label>
                Username:
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required  
                />
            </label>
            <label>
                Password:
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </label>
            <button type="submit">Login</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
    )
};

export default LoginForm;