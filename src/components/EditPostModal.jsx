import { useState, useRef, useEffect } from 'react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import { API_BASE_URL } from '../config';
import './EditPostModal.css';

const EditPostModal = ({ post, onClose, onUpdate }) => {
    const { addToast } = useToast();
    const [description, setDescription] = useState(post.description || '');
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null);

    // Initial state: combine existing files from the post
    // post.post_files contains relative paths like "posts/abc.jpg"
    // post.files contains mapped URLs
    const [allMedia, setAllMedia] = useState([
        ...(post.post_files || []).map(path => ({
            type: 'existing',
            path: path,
            url: path.startsWith('http') ? path : `${API_BASE_URL}/storage/${path}`
        }))
    ]);

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            const newItems = files.map(file => ({
                type: 'new',
                file: file,
                url: URL.createObjectURL(file)
            }));
            setAllMedia(prev => [...prev, ...newItems]);
        }
    };

    const removeFile = (index) => {
        const item = allMedia[index];
        if (item.type === 'new') {
            URL.revokeObjectURL(item.url);
        }
        setAllMedia(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        setLoading(true);
        const formData = new FormData();
        formData.append('_method', 'PUT'); // Laravel handles PUT with FormData via _method
        formData.append('description', description);

        // Separate existing paths to keep and new files to upload
        let hasExistingAttr = false;
        allMedia.forEach(item => {
            if (item.type === 'existing') {
                formData.append('existing_files[]', item.path);
                hasExistingAttr = true;
            } else {
                formData.append('post_files[]', item.file);
            }
        });

        // If user removed all existing files, we MUST send existing_files as empty 
        // to tell the backend to actually delete them.
        if (!hasExistingAttr && (post.post_files?.length > 0)) {
            formData.append('existing_files', '');
        }

        try {
            const response = await api.post(`/api/posts/${post.id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.data.status) {
                // Success handled by handleUpdate in PostCard which calls addToast
                onUpdate(response.data.data);
                onClose();
            }
        } catch (error) {
            console.error("Failed to update post", error);
            addToast(error.response?.data?.message || "Failed to update post", "danger");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fb-modal-overlay" onClick={onClose}>
            <div className="fb-modal-content card" onClick={e => e.stopPropagation()}>
                <div className="fb-modal-header d-flex justify-content-between align-items-center p-3 border-bottom">
                    <h5 className="m-0 fw-bold">Edit Post</h5>
                    <button className="btn-close" onClick={onClose}></button>
                </div>
                <div className="fb-modal-body p-3">
                    <textarea
                        className="form-control border-0 mb-3"
                        style={{ minHeight: '120px', resize: 'none' }}
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        placeholder="What's on your mind?"
                    />

                    <div className="d-flex gap-2 flex-wrap mb-3">
                        {allMedia.map((item, index) => (
                            <div key={index} className="position-relative">
                                {item.url.match(/\.(mp4|webm|ogg|quicktime)$/i) || (item.file && item.file.type.startsWith('video/')) ? (
                                    <video src={item.url} className="rounded" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                                ) : (
                                    <img src={item.url} alt="Preview" className="rounded" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                                )}
                                <button className="btn btn-sm btn-danger position-absolute top-0 end-0 p-0 rounded-circle"
                                    style={{ width: '20px', height: '20px', zIndex: 1 }}
                                    onClick={() => removeFile(index)}>&times;</button>
                            </div>
                        ))}
                    </div>

                    <div role="button" onClick={() => fileInputRef.current?.click()} className="d-flex align-items-center gap-2 p-2 border rounded hover-bg-light">
                        <i className="ti ti-photo text-success fs-4"></i>
                        <span className="fw-bold">Add to your post</span>
                    </div>
                    <input type="file" ref={fileInputRef} hidden multiple accept="image/*,video/*" onChange={handleFileSelect} />
                </div>
                <div className="fb-modal-footer p-3">
                    <button className="btn btn-primary w-100 fw-bold" disabled={loading} onClick={handleSubmit}>
                        {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditPostModal;
