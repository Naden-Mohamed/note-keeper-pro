import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signIn, signUp } from '../services/api'; // Adjust import path

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Initialize auth state from localStorage
    useEffect(() => {
        try {
            const storedUser = localStorage.getItem('profile');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        } catch (err) {
            console.error('Failed to parse user data:', err);
            localStorage.removeItem('profile');
        } finally {
            setLoading(false);
        }
    }, []);

    const login = async (formData) => {
        try {
            setLoading(true);
            setError(null);
            const { data } = await signIn(formData);

            localStorage.setItem('profile', JSON.stringify(data));
            setUser(data);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Login failed');
            throw err; // Re-throw for form handling
        } finally {
            setLoading(false);
        }
    };

    const register = async (formData) => {
        try {
            setLoading(true);
            setError(null);
            const { data } = await signUp(formData);

            localStorage.setItem('profile', JSON.stringify(data));
            setUser(data);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Registration failed');
            throw err; // Re-throw for form handling
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        try {
            localStorage.removeItem('profile');
            setUser(null);
            navigate('/login'); // Redirect after logout
        } catch (err) {
            console.error('Logout failed:', err);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                error,
                login,
                register,
                logout,
                setError
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};