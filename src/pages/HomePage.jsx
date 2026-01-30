import { useState } from 'react';
import LoginForm from '../components/LoginForm';
import SignupForm from '../components/SignupForm';

const HomePage = () => {
    const [showLogin, setShowLogin] = useState(false);

    return (
        <>
            {/* Hero section */}
            <div className="container-fluid lp-bg-img">
                <div className="overlay" id="overlay"></div>
                <div className="container">
                    <div className="row">
                        {/* left content */}
                        <div className="col-12 col-md-8 pt-4 lp-hero-content">
                            <div className="lp-txt-content">
                                <h1>Join Our Franchise Community!</h1>
                                <p>
                                    Discover a platform where you can connect with top franchisors
                                    and industry consultants. Engage with experts, access valuable
                                    insights, and join a community dedicated to supporting your
                                    franchise journey.
                                </p>
                            </div>
                        </div>

                        {/* right form */}
                        <div className="col-12 col-md-4">
                            {showLogin ? (
                                <LoginForm onSwitchToSignup={() => setShowLogin(false)} />
                            ) : (
                                <SignupForm onSwitchToLogin={() => setShowLogin(true)} />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Other sections placeholders */}
            <div className="container">
                <div className="row">
                    <div className="col-12 mt-5">
                        <h2>Top Franchises (Coming Soon)</h2>
                    </div>
                </div>
            </div>
        </>
    );
};

export default HomePage;
