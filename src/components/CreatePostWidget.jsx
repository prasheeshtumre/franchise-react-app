import { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { API_BASE_URL } from '../config';
import './CreatePostWidget.css';

const CreatePostWidget = ({ onPostCreated }) => {
    const { user } = useAuth();
    const [description, setDescription] = useState('');
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const fileInputRef = useRef(null);

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            setSelectedFiles((prev) => [...prev, ...files]);

            // Generate previews
            const newPreviews = files.map(file => URL.createObjectURL(file));
            setPreviews((prev) => [...prev, ...newPreviews]);
        }
    };

    const removeFile = (index) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
        setPreviews(prev => {
            // Revoke URL to prevent memory leaks
            URL.revokeObjectURL(prev[index]);
            return prev.filter((_, i) => i !== index);
        });
    };

    const handleSubmit = async () => {
        if (!description.trim() && selectedFiles.length === 0) return;

        setLoading(true);
        const formData = new FormData();
        formData.append('user_id', user.id);
        formData.append('description', description);

        selectedFiles.forEach((file) => {
            formData.append('post_files[]', file);
        });

        try {
            const response = await api.post('/api/user/post/store', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.data.status === 'success' || response.data.status === true || response.status === 200 || response.status === 201) {
                // Map the new post to match PostFeed's expected structure
                const rawPost = response.data.data;
                const newPost = rawPost ? {
                    ...rawPost,
                    user: {
                        first_name: user.first_name,
                        last_name: user.last_name
                    },
                    files: (rawPost.post_files || []).map(f => ({
                        file_path: f.startsWith('http') ? f : API_BASE_URL + `/storage/${f}`
                    }))
                } : {
                    id: Date.now(),
                    user_id: user.id,
                    description: description,
                    created_at: new Date().toISOString(),
                    user: user,
                    files: selectedFiles.map(f => ({ file_path: URL.createObjectURL(f) }))
                };

                onPostCreated(newPost);

                // Reset form
                setDescription('');
                setSelectedFiles([]);
                setPreviews([]);
                setIsExpanded(false);
                if (fileInputRef.current) fileInputRef.current.value = '';
            }
        } catch (error) {
            console.error("Failed to create post", error);
            // Optionally show error toast
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fb-post-card card p-3 mb-3">
            <div className={`d-flex gap-2 ${isExpanded ? 'align-items-start' : 'align-items-center'}`}>
                <img
                    src={user?.profile_image || "/assets/images/user-icons/user-icon-pic.png"}
                    alt="User"
                    className="rounded-circle"
                    style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                />
                <div className="w-100">
                    <textarea
                        className="form-control border-0 bg-light"
                        placeholder={`What's on your mind, ${user?.first_name || 'User'}?`}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        onClick={() => setIsExpanded(true)}
                        style={{
                            resize: 'none',
                            height: isExpanded ? '100px' : '40px',
                            minHeight: '40px',
                            transition: 'height 0.2s'
                        }}
                    />

                    {/* File Previews */}
                    {previews.length > 0 && (
                        <div className="d-flex gap-2 mt-2 flex-wrap">
                            {previews.map((src, index) => (
                                <div key={index} className="position-relative">
                                    <img src={src} alt="Preview" className="rounded" style={{ height: '80px', width: 'auto' }} />
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-danger position-absolute top-0 end-0 p-0 rounded-circle d-flex align-items-center justify-content-center"
                                        style={{ width: '20px', height: '20px', transform: 'translate(50%, -50%)' }}
                                        onClick={() => removeFile(index)}
                                    >
                                        &times;
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {isExpanded && (
                        <div className="d-flex justify-content-between align-items-center mt-3 pt-2 border-top">
                            <div className="d-flex gap-3 text-secondary">
                                <div role="button" onClick={() => fileInputRef.current?.click()} className="d-flex align-items-center gap-1 hover-bg-light p-1 rounded">
                                    <i className="bi bi-image text-success"></i>
                                    <span className="small fw-semibold">Photo/Video</span>
                                </div>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    multiple
                                    accept="image/*,video/*"
                                    className="d-none"
                                    onChange={handleFileSelect}
                                />
                            </div>
                            <button
                                className="btn btn-primary px-4 rounded-pill"
                                disabled={!description.trim() && selectedFiles.length === 0 || loading}
                                onClick={handleSubmit}
                            >
                                {loading ? 'Posting...' : 'Post'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CreatePostWidget;
