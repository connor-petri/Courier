import React from 'react';
import { useState } from 'react';
import { supabase } from '../supabase-client';

interface LoginFormProps {
    onLoginSuccess: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }: LoginFormProps) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayError, setDisplayError] = useState<string | null>(null);
    const [isRegister, setIsRegister] = useState<boolean>(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (isRegister) {
            const {error} = await supabase.auth.signUp({email, password});
            if (error) {
                console.error("Error during registration: " + error.message);
                setDisplayError(error.message);
            } else {
                setIsRegister(false);
            }
            
        } else {
            const {error} = await supabase.auth.signInWithPassword({email, password});
            if (error) {
                console.error("Error during login: " + error.message);
            } else {
                console.log("calling onLoginSuccess()");
                onLoginSuccess();
            }
        }
    }
        
    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', maxWidth: '300px', margin: 'auto' }}>
            <label>
                Email:
                <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
            <button type="submit">{isRegister ? "Register" : "Log In"}</button>
            {displayError && <p style={{ color: 'red' }}>{displayError}</p>}
            <center> <p>{isRegister ? "Already have an account?" : "Don't have an account?"}</p> </center>
            <button type="button" onClick={() => { setIsRegister(isRegister ? false : true)}}> {isRegister ? "Sign In" : "Sign Up"} </button>
        </form>
    )
};

export default LoginForm;