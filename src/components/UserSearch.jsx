import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import FollowButton from './FollowButton';
import './UserSearch.css';

const UserSearch = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const searchRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (query.length > 1) {
                setLoading(true);
                setIsOpen(true);
                try {
                    const response = await api.get(`/api/user/search?q=${query}`);
                    if (response.data.status === 'success') {
                        setResults(response.data.data);
                    }
                } catch (error) {
                    console.error("Search error:", error);
                } finally {
                    setLoading(false);
                }
            } else {
                setResults([]);
                setIsOpen(false);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [query]);

    const handleUserClick = (userId) => {
        setIsOpen(false);
        setQuery('');
        navigate(`/user-profile/${userId}`);
    };

    return (
        <div className="fb-search-container" ref={searchRef}>
            <div className="fb-search-bar bg-light rounded-pill px-3 py-2 d-flex align-items-center">
                <i className="bi bi-search text-muted me-2"></i>
                <input
                    type="search"
                    className="form-control border-0 bg-transparent p-0"
                    placeholder="Search people..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => query.length > 1 && setIsOpen(true)}
                    style={{ outline: 'none', boxShadow: 'none' }}
                />
            </div>

            {isOpen && (
                <div className="fb-search-results card shadow mt-2 p-2">
                    {loading && <div className="text-center py-2 small text-muted">Searching...</div>}
                    {!loading && results.length === 0 && (
                        <div className="text-center py-2 small text-muted">No people found</div>
                    )}
                    {results.map(user => (
                        <div key={user.id} className="fb-search-item d-flex align-items-center justify-content-between p-2 hover-bg-light rounded">
                            <div className="d-flex align-items-center gap-2 cursor-pointer" onClick={() => handleUserClick(user.id)}>
                                <img
                                    src={user.profile_image || "/assets/images/user-icons/user-prf-pic.png"}
                                    alt="User"
                                    className="rounded-circle"
                                    style={{ width: '36px', height: '36px', objectFit: 'cover' }}
                                />
                                <span className="fw-semibold small">{user.first_name} {user.last_name}</span>
                            </div>
                            <FollowButton userId={user.id} initialIsFollowing={user.is_following} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UserSearch;
