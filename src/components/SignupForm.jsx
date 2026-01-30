import { useState } from 'react';
import PropTypes from 'prop-types';
import api from '../services/api';
import './SignupForm.css';

const SignupForm = ({ onSwitchToLogin }) => {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        confirmPassword: '',
        terms: false
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Validation
        if (!formData.first_name || !formData.last_name || !formData.email || !formData.password || !formData.confirmPassword) {
            setError('Please fill in all the fields.');
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match!');
            return;
        }
        if (!formData.terms) {
            setError('You must agree to the terms and conditions.');
            return;
        }

        setLoading(true);

        try {
            const payload = {
                first_name: formData.first_name,
                last_name: formData.last_name,
                email: formData.email,
                password: formData.password,
                password_confirmation: formData.confirmPassword,
                // phone: '' // omitted as per analysis
            };

            const response = await api.post('api/register', payload);
            if (response.data.status === 'success') {
                setSuccess('Registration successful! Please check your email to verify it.');
                // Optionally auto-switch to login after some time
                setTimeout(() => {
                    if (onSwitchToLogin) onSwitchToLogin();
                }, 3000);
            } else {
                setError(response.data.message || 'Registration failed');
            }
        } catch (err) {
            setError('An error occurred during registration.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="lp-form-container">
            <h5>Signup to get started</h5>
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <form onSubmit={handleSubmit} className="form-box">
                <div className="row">
                    <div className="col-12 col-md-6 mb-2">
                        <div className="lp-form-holder w-100 d-flex align-items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-user">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
                                <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
                            </svg>
                            <input type="text" name="first_name" placeholder="First Name" value={formData.first_name} onChange={handleChange} className="border-0 bg-transparent ms-2 w-100" style={{ outline: 'none' }} />
                        </div>
                    </div>
                    <div className="col-12 col-md-6 mb-2">
                        <div className="lp-form-holder w-100 d-flex align-items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-user">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
                                <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
                            </svg>
                            <input type="text" name="last_name" placeholder="Last Name" value={formData.last_name} onChange={handleChange} className="border-0 bg-transparent ms-2 w-100" style={{ outline: 'none' }} />
                        </div>
                    </div>
                </div>

                <div className="lp-form-holder">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-mail">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10z" />
                        <path d="M3 7l9 6l9 -6" />
                    </svg>
                    <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} />
                </div>

                <div className="lp-form-holder">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-lock">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M5 13a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-6z" />
                        <path d="M11 16a1 1 0 1 0 2 0a1 1 0 0 0 -2 0" />
                        <path d="M8 11v-4a4 4 0 1 1 8 0v4" />
                    </svg>
                    <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} />
                </div>

                <div className="lp-form-holder">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-lock">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M5 13a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-6z" />
                        <path d="M11 16a1 1 0 1 0 2 0a1 1 0 0 0 -2 0" />
                        <path d="M8 11v-4a4 4 0 1 1 8 0v4" />
                    </svg>
                    <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} />
                </div>

                <div className="terms-cbox d-flex flex-row justify-content-start align-items-center">
                    <input type="checkbox" name="terms" id="terms" checked={formData.terms} onChange={handleChange} />
                    <p>
                        I agree to the <a target="_blank" href="/terms-and-conditions">Terms of Services </a>&
                        <a href="/privacy-policy"> Privacy Policy</a>
                    </p>
                </div>

                <button className="lp-submit-btn" disabled={loading}>
                    {loading ? 'Submitting...' : 'Submit'}
                </button>

                <div className="lp-have-act-text">
                    <p>
                        Already have account? <a href="#" onClick={(e) => { e.preventDefault(); onSwitchToLogin(); }}>Login</a>
                    </p>
                </div>
            </form>
        </div>
    );
};

SignupForm.propTypes = {
    onSwitchToLogin: PropTypes.func.isRequired
};

export default SignupForm;
