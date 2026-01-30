import { useState, useEffect } from 'react';
import PostItem from './PostItem';
import api from '../services/api';
import { API_BASE_URL } from '../config';
import './PostFeed.css';

const PostFeed = ({ newPosts }) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Initial fetch
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await api.get('/api/user/post/get/3');
                if (response.data.status === true) {
                    const mappedPosts = response.data.data.map(post => ({
                        ...post,
                        user: {
                            first_name: post.user?.first_name || 'User',
                            last_name: post.user?.last_name || ''
                        },
                        files: (post.post_files || []).map(f => ({
                            file_path: `${API_BASE_URL}/storage/${f}`
                        }))
                    }));
                    setPosts(mappedPosts);
                }


                // MOCK DATA for demonstration until API is connected
                // const mockPosts = [
                //     {
                //         id: 999,
                //         user: { first_name: 'KFC', last_name: 'Corporation' },
                //         created_at: new Date(Date.now() - 7200000).toISOString(),
                //         description: "Owning a KFC Franchise: Key Insights for Prospective Buyers.\n\nHello community! As a proud owner of a KFC franchise, I wanted to share some valuable insights...",
                //         files: [{ file_path: "/assets/images/post-imgs/kfc-post.jpg" }]
                //     }
                // ];
                // setPosts(mockPosts);

            } catch (error) {
                console.error("Error fetching posts:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    // Merge new posts from props
    useEffect(() => {
        if (newPosts && newPosts.length > 0) {
            setPosts(prev => {
                // Prevent duplicates if needed
                const ids = new Set(prev.map(p => p.id));
                const uniqueNew = newPosts.filter(p => !ids.has(p.id));
                return [...uniqueNew, ...prev];
            });
        }
    }, [newPosts]);

    if (loading) return <div className="text-center py-4">Loading feed...</div>;

    return (
        <div className="fb-feed-container">
            {posts.map(post => (
                <PostItem key={post.id} post={post} />
            ))}
            {posts.length === 0 && (
                <div className="text-center text-muted py-5">
                    No posts yet. Be the first to share!
                </div>
            )}
        </div>
    );
};

export default PostFeed;
