import { createContext, useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('auth_token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Validate token or fetch user details if needed
        if (token) {
            const storedUserStr = localStorage.getItem('user_details');
            if (storedUserStr) {
                setUser(JSON.parse(storedUserStr));
            } else {
                // Fallback if only ID is stored (legacy compat)
                const userId = localStorage.getItem('user_id');
                if (userId) setUser({ id: userId, first_name: 'User', last_name: '' });
            }
        }
        setLoading(false);
    }, [token]);

    const login = (data) => {
        localStorage.setItem('auth_token', data.access_token);
        localStorage.setItem('user_id', data.user_details.id);
        localStorage.setItem('user_details', JSON.stringify(data.user_details));
        localStorage.setItem('status', 'success');
        setToken(data.access_token);
        setUser(data.user_details);
    };

    const logout = () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_id');
        localStorage.removeItem('user_details');
        localStorage.removeItem('status');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export const useAuth = () => useContext(AuthContext);
