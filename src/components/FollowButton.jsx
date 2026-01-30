import { useState, useEffect } from 'react';
import api from '../services/api';

const FollowButton = ({ userId, initialIsFollowing, onToggle }) => {
    const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setIsFollowing(initialIsFollowing);
    }, [initialIsFollowing]);

    const handleFollowToggle = async () => {
        setLoading(true);
        try {
            if (isFollowing) {
                await api.post(`/api/user/unfollow/${userId}`);
                setIsFollowing(false);
                if (onToggle) onToggle(false);
            } else {
                await api.post(`/api/user/follow/${userId}`);
                setIsFollowing(true);
                if (onToggle) onToggle(true);
            }
        } catch (error) {
            console.error("Error toggling follow:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            className={`btn btn-sm ${isFollowing ? 'btn-light border' : 'btn-primary'} fw-bold px-3`}
            onClick={handleFollowToggle}
            disabled={loading}
        >
            {loading ? '...' : isFollowing ? 'Following' : 'Follow'}
        </button>
    );
};

export default FollowButton;
