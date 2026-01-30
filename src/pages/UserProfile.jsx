import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import CreatePostWidget from '../components/CreatePostWidget';
import PostFeed from '../components/PostFeed';
import './UserProfile.css';

const UserProfile = () => {
    const { user, logout } = useAuth();
    const [newPosts, setNewPosts] = useState([]);

    const handlePostCreated = (post) => {
        setNewPosts(prev => [post, ...prev]);
    };

    return (
        <div className="container-fluid user-profile-main pt-3">
            <div className="container">
                {/* Tab Bar */}
                <div className="tab-bar d-flex justify-content-center align-items-center mb-4">
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
                    {/* Left Sidebar - Profile Card */}
                    <div className="col-12 col-md-3">
                        <div className="profile-card card p-3 mb-4">
                            <div className="profile-header text-center">
                                <img src="/assets/images/user-icons/user-prf-pic.png" alt="Profile" className="rounded-circle mb-2" style={{ width: '80px' }} />
                                <h2>{user?.first_name} {user?.last_name}</h2>
                                <p className="text-muted">Regional Manager</p>
                                <p className="text-primary">@QuickBite Restaurants</p>
                            </div>
                            <hr />
                            <div className="profile-stats d-flex justify-content-around text-center">
                                <div><h3>262</h3><p>Followers</p></div>
                                <div><h3>40</h3><p>Posts</p></div>
                                <div><h3>1.3k</h3><p>Views</p></div>
                            </div>
                            <hr />
                            <button className="btn btn-outline-primary w-100" onClick={logout}>Logout</button>
                        </div>
                    </div>

                    {/* Middle Column - Feed */}
                    <div className="col-12 col-md-6">
                        <CreatePostWidget onPostCreated={handlePostCreated} />
                        <PostFeed newPosts={newPosts} />
                    </div>

                    {/* Right Column - Recommendations */}
                    <div className="col-12 col-md-3">
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
