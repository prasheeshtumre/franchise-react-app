import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { API_BASE_URL } from '../config';
import PostMediaGrid from './PostMediaGrid';
import CommentSection from './CommentSection';
import EditPostModal from './EditPostModal';
import api from '../services/api';
import './PostCard.css';

const PostCard = ({ post: initialPost, onDelete }) => {
    const { user } = useAuth();
    const { addToast } = useToast();
    const [post, setPost] = useState(initialPost);

    const [isLiked, setIsLiked] = useState(post.likes?.some(l => l.user_id === user?.id));
    const [likesCount, setLikesCount] = useState(post.likes_count || 0);
    const [showComments, setShowComments] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [commentsCount, setCommentsCount] = useState(post.comments_count || 0);

    const handleUpdate = (updatedPost) => {
        const mapped = {
            ...updatedPost,
            files: (updatedPost.post_files || []).map(f => ({
                file_path: f.startsWith('http') ? f : `${API_BASE_URL}/storage/${f}`
            }))
        };
        setPost(mapped);
        addToast("Post updated successfully!");
    };

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

    const handleLike = async () => {
        const previousState = isLiked;
        const previousCount = likesCount;

        setIsLiked(!isLiked);
        setLikesCount(prev => isLiked ? prev - 1 : prev + 1);

        try {
            if (previousState) {
                await api.post(`/api/user/post/${post.id}/unlike`);
            } else {
                await api.post(`/api/user/post/${post.id}/like`);
            }
        } catch (error) {
            console.error("Error liking post:", error);
            setIsLiked(previousState);
            setLikesCount(previousCount);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this post?")) return;

        try {
            const response = await api.delete(`/api/posts/${post.id}`);
            if (response.data.status) {
                addToast("Post deleted successfully");
                if (onDelete) onDelete(post.id);
            }
        } catch (error) {
            console.error("Error deleting post:", error);
            addToast(error.response?.data?.message || "Failed to delete post", "danger");
        }
    };

    const handleShare = async () => {
        try {
            await api.post(`/api/user/post/${post.id}/share`);
            addToast("Post shared successfully!");
        } catch (error) {
            console.error("Error sharing post:", error);
            addToast("Failed to share post", "danger");
        }
    };

    return (
        <div className="fb-post-card card">
            <div className="fb-post-header">
                <div className="d-flex align-items-center gap-2">
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

                {/* Secure Ownership Check & SVG Icon for visibility */}
                {user && post && Number(user.id) === Number(post.user_id) && (
                    <div className="dropdown ms-auto">
                        <button className="btn btn-link text-dark p-1" type="button" data-bs-toggle="dropdown" aria-expanded="false" style={{ textDecoration: 'none' }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.7 }}>
                                <circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="5" r="1.5" /><circle cx="12" cy="19" r="1.5" />
                            </svg>
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end">
                            <li>
                                <button className="dropdown-item d-flex align-items-center gap-2" onClick={() => setShowEditModal(true)}>
                                    <i className="ti ti-edit"></i> Edit
                                </button>
                            </li>
                            <li>
                                <button className="dropdown-item text-danger d-flex align-items-center gap-2" onClick={handleDelete}>
                                    <i className="ti ti-trash"></i> Delete
                                </button>
                            </li>
                        </ul>
                    </div>
                )}
            </div>

            <div className="fb-post-content">
                <p className="mb-0" style={{ whiteSpace: 'pre-line' }}>{post.description}</p>
            </div>

            <PostMediaGrid files={post.files} />

            <div className="fb-post-footer">
                <div className="fb-stats-row px-1 py-2 d-flex justify-content-between text-muted small">
                    <div>
                        <i className="ti ti-thumb-up text-primary"></i> {likesCount}
                    </div>
                    <div>
                        <span>{commentsCount} comments</span>
                    </div>
                </div>
                <div className="fb-action-row">
                    <button
                        className={`fb-action-btn ${isLiked ? 'text-primary' : ''}`}
                        onClick={handleLike}
                    >
                        <i className={`ti ${isLiked ? 'ti-thumb-up' : 'ti-thumb-up'}`}></i> Like
                    </button>
                    <button
                        className="fb-action-btn"
                        onClick={() => setShowComments(!showComments)}
                    >
                        <i className="ti ti-message-2"></i> Comment
                    </button>
                    <button className="fb-action-btn" onClick={handleShare}>
                        <i className="ti ti-share"></i> Share
                    </button>
                </div>
            </div>

            {showComments && (
                <CommentSection
                    postId={post.id}
                    comments={post.comments}
                    onCommentAdded={() => setCommentsCount(prev => prev + 1)}
                />
            )}

            {showEditModal && (
                <EditPostModal
                    post={post}
                    onClose={() => setShowEditModal(false)}
                    onUpdate={handleUpdate}
                />
            )}
        </div>
    );
};

export default PostCard;
