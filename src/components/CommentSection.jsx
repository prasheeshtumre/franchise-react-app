import { useState, useEffect } from 'react';
import api from '../services/api';
import './CommentSection.css';

const CommentSection = ({ postId, comments: initialComments, onCommentAdded }) => {
    const [commentText, setCommentText] = useState('');
    const [comments, setComments] = useState(initialComments || []);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!commentText.trim()) return;

        setLoading(true);
        try {
            const response = await api.post(`/api/user/post/${postId}/comment`, {
                comment: commentText
            });
            if (response.data.status) {
                const newComment = response.data.data;
                setComments(prev => [newComment, ...prev]);
                setCommentText('');
                if (onCommentAdded) onCommentAdded(newComment);
            }
        } catch (error) {
            console.error("Error adding comment:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fb-comment-section border-top">
            <div className="fb-comment-input-area p-3">
                <form onSubmit={handleSubmit} className="d-flex gap-2">
                    <img 
                        src="/assets/images/user-icons/user-prf-pic.png" 
                        alt="User" 
                        className="rounded-circle"
                        style={{ width: '32px', height: '32px', objectFit: 'cover' }}
                    />
                    <div className="flex-grow-1 position-relative">
                        <input
                            type="text"
                            className="form-control bg-light border-0 rounded-pill pe-5"
                            placeholder="Write a comment..."
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            disabled={loading}
                        />
                        <button 
                            type="submit" 
                            className="btn btn-link position-absolute end-0 top-50 translate-middle-y text-primary"
                            disabled={!commentText.trim() || loading}
                        >
                            <i className="bi bi-send-fill"></i>
                        </button>
                    </div>
                </form>
            </div>

            <div className="fb-comments-list px-3 pb-3">
                {comments.map((c) => (
                    <div key={c.id} className="fb-comment-item d-flex gap-2 mb-2">
                        <img 
                            src={c.user?.profile_image || "/assets/images/user-icons/user-prf-pic.png"} 
                            alt="User" 
                            className="rounded-circle mt-1"
                            style={{ width: '32px', height: '32px', objectFit: 'cover' }}
                        />
                        <div className="fb-comment-bubble bg-light p-2 px-3 rounded-4">
                            <h6 className="m-0 fw-bold small">
                                {c.user?.first_name} {c.user?.last_name}
                            </h6>
                            <p className="m-0 small">{c.comment}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CommentSection;
