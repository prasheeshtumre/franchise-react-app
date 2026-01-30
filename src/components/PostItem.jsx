import { useAuth } from '../context/AuthContext';
import PostMediaGrid from './PostMediaGrid';
import './PostItem.css';

const PostItem = ({ post }) => {
    // Helper to format date
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        return date.toLocaleDateString();
    };

    return (
        <div className="fb-post-card card">
            <div className="fb-post-header">
                <img
                    src={post.user?.profile_image || "/assets/images/user-icons/user-prf-pic.png"}
                    alt="Profile"
                    className="rounded-circle"
                    style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                />
                <div>
                    <h6 className="m-0 fw-bold">{post.user?.first_name} {post.user?.last_name}</h6>
                    <small className="text-muted">{formatDate(post.created_at)}</small>
                </div>
            </div>

            <div className="fb-post-content">
                <p className="mb-0" style={{ whiteSpace: 'pre-line' }}>{post.description}</p>
            </div>

            <PostMediaGrid files={post.files} />

            <div className="fb-post-footer">
                <div className="fb-action-row">
                    <button className="fb-action-btn">
                        <i className="bi bi-hand-thumbs-up"></i> Like
                    </button>
                    <button className="fb-action-btn">
                        <i className="bi bi-chat"></i> Comment
                    </button>
                    <button className="fb-action-btn">
                        <i className="bi bi-share"></i> Share
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PostItem;
