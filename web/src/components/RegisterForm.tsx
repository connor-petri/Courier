import React, { useState } from 'react';
import { getCSRFToken } from '../utils/csrf';

interface RegisterFormProps {
    onRegisterSuccess: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onRegisterSuccess }: RegisterFormProps) => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const serverAddress: URL = new URL('http://' + process.env.REACT_APP_SERVER_IP + ':' + process.env.REACT_APP_SERVER_PORT);

            const csrfToken: string | null = getCSRFToken();
            console.log('CSRF Token:', csrfToken);
            if (!csrfToken) {
                throw new Error('CSRF token not found');
            }


            const response: Response = await fetch(serverAddress + 'register/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken,
                },
                body: JSON.stringify({ username, password})
            });

            if (!response.ok) {
                throw new Error('Registration failed. Please check your credentials');
            }

            const data = await response.json();
            console.log('Registration successful:', data);
            onRegisterSuccess(); // Call the success callback
            
        } catch (e: any) {
            console.error('Failed to register:', e);
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
            <label>
                Confirm Password:
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
                <button type='submit'>Register</button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </label>
        </form>
    )
}

export default RegisterForm;