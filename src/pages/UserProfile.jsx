import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CreatePostWidget from '../components/CreatePostWidget';
import PostFeed from '../components/PostFeed';
import FollowButton from '../components/FollowButton';
import api from '../services/api';
import './UserProfile.css';

const UserProfile = () => {
    const { id } = useParams();
    const { user: currentUser, logout } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [newPosts, setNewPosts] = useState([]);

    const targetId = id || currentUser?.id;
    const isOwnProfile = !id || parseInt(id) === currentUser?.id;

    useEffect(() => {
        const fetchProfileData = async () => {
            setLoading(true);
            try {
                const [profileRes, postsRes] = await Promise.all([
                    api.get(`/api/user/profile/${targetId}`),
                    api.get(`/api/user/${targetId}/posts`)
                ]);

                if (profileRes.data.status === 'success') {
                    setProfile(profileRes.data.data);
                }
                if (postsRes.data.status) {
                    // We can pass these to PostFeed or handle them here
                    // For now, let's reset newPosts to these if needed, or just let PostFeed fetch
                    // Actually, let's pass them to PostFeed or make PostFeed dynamic
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
            } finally {
                setLoading(false);
            }
        };

        if (targetId) fetchProfileData();
    }, [targetId]);

    const handlePostCreated = (post) => {
        setNewPosts(prev => [post, ...prev]);
        // Update stats optimistically
        setProfile(prev => ({ ...prev, posts_count: (prev.posts_count || 0) + 1 }));
    };

    return (
        <div className="container-fluid user-profile-main pt-3">
            <div className="container">
                {/* Tab Bar - Sticky */}
                <div className="tab-bar d-flex justify-content-center align-items-center mb-4 sticky-top-custom">
                    <ul className="tab-links list-unstyled d-flex gap-4">
                        <li><Link to="#Feed" className="text-decoration-none">Feed</Link></li>
                        <li><Link to="#News" className="text-decoration-none">News</Link></li>
                        <li><Link to="#Community" className="text-decoration-none">Community</Link></li>
                        <li><Link to="#Events" className="text-decoration-none">Events</Link></li>
                        <li><Link to="#Resources" className="text-decoration-none">Resources</Link></li>
                    </ul>
                </div>

                {/* Feed Container */}
                <div className="row">
                    {/* Left Sidebar - Profile Card - Sticky */}
                    <div className="col-12 col-lg-3 sticky-sidebar">
                        <div className="profile-card card p-3 mb-4">
                            {loading ? (
                                <div className="text-center py-4">Loading profile...</div>
                            ) : (
                                <>
                                    <div className="profile-header text-center">
                                        <img src={profile?.profile_image || "/assets/images/user-icons/user-prf-pic.png"} alt="Profile" className="rounded-circle mb-2" style={{ width: '80px', height: '80px', objectFit: 'cover' }} />
                                        <h2 className="fs-4">{profile?.first_name} {profile?.last_name}</h2>
                                        <p className="text-muted mb-1">User profile bio</p>
                                        <p className="text-primary small">@{profile?.first_name?.toLowerCase()}</p>

                                        {!isOwnProfile && (
                                            <div className="mt-2">
                                                <FollowButton
                                                    userId={profile?.id}
                                                    initialIsFollowing={profile?.is_following}
                                                    onToggle={(isNowFollowing) => {
                                                        setProfile(prev => ({
                                                            ...prev,
                                                            is_following: isNowFollowing,
                                                            followers_count: isNowFollowing
                                                                ? (prev.followers_count || 0) + 1
                                                                : Math.max(0, (prev.followers_count || 0) - 1)
                                                        }));
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                    <hr />
                                    <div className="profile-stats d-flex justify-content-around text-center">
                                        <div><h3 className="fs-5">{profile?.followers_count || 0}</h3><p className="small text-muted">Followers</p></div>
                                        <div><h3 className="fs-5">{profile?.posts_count || 0}</h3><p className="small text-muted">Posts</p></div>
                                        <div><h3 className="fs-5">{profile?.following_count || 0}</h3><p className="small text-muted">Following</p></div>
                                    </div>
                                    <hr />
                                    {isOwnProfile && <button className="btn btn-outline-primary w-100" onClick={logout}>Logout</button>}
                                </>
                            )}
                        </div>
                    </div>

                    {/* Middle Column - Feed */}
                    <div className="col-12 col-lg-6">
                        {isOwnProfile && <CreatePostWidget onPostCreated={handlePostCreated} />}
                        <PostFeed key={targetId} userId={targetId} newPosts={newPosts} />
                    </div>

                    {/* Right Column - Recommendations - Sticky */}
                    <div className="col-12 col-lg-3 d-none d-lg-block sticky-sidebar">
                        <div className="card p-3">
                            <h5>Interested Franchises</h5>
                            <ul className="list-unstyled">
                                <li className="mb-2">Scooter&apos;s Coffee</li>
                                <li className="mb-2">Hampton</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
