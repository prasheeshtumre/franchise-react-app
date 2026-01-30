import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './LoginForm.css';

const LoginForm = ({ onSwitchToSignup }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await api.post('api/login', { email, password });
            if (response.data.status === 'success') {
                login(response.data.data);
                navigate('/user-profile');
            } else {
                setError(response.data.message || 'Login failed');
            }
        } catch (err) {
            setError('An error occurred during login.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="lp-login-form-container">
            <h5>Login to get started</h5>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit} id="login-form">
                <div className="lp-lgfrm-holder">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-mail">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10z" />
                        <path d="M3 7l9 6l9 -6" />
                    </svg>
                    <input
                        type="text"
                        id="login-email"
                        name="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="lp-lgfrm-holder">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-lock">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M5 13a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-6z" />
                        <path d="M11 16a1 1 0 1 0 2 0a1 1 0 0 0 -2 0" />
                        <path d="M8 11v-4a4 4 0 1 1 8 0v4" />
                    </svg>
                    <input
                        type="password"
                        id="login-password"
                        placeholder="Password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <div className="lp-lgfrm-frgp d-flex justify-content-between">
                    <span>Verify Mail</span>
                    <span>Forgot Password</span>
                </div>

                <button className="lp-lgfrm-submit-btn" disabled={loading}>
                    {loading ? 'Submitting...' : 'Submit'}
                </button>

                <div className="lp-have-lgfrm-text">
                    <p>
                        Don&apos;t have account? <a href="#" id="signup-action" onClick={(e) => { e.preventDefault(); if (onSwitchToSignup) onSwitchToSignup(); }}>Signup</a>
                    </p>
                </div>
            </form>
        </div>
    );
};

LoginForm.propTypes = {
    onSwitchToSignup: PropTypes.func
};

export default LoginForm;
