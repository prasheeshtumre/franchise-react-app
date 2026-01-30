import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer>
            <div className="container-fluid footer-container">
                <div className="container">
                    <div className="row">
                        {/* main container */}
                        <div className="d-none d-md-block col-md-3">
                            <div className="mb-4 mt-4 footer-content">
                                <img src="/assets/images/logos/company_logo.png" alt="Company Logo" />
                                <h6>About</h6>
                                <p>
                                    We connect entrepreneurs with leading franchisors and
                                    consultants, facilitating valuable interactions that help
                                    franchise brands succeed. By building a supportive
                                    community and providing expert advice, making us a trusted
                                    resource in franchising.
                                </p>
                            </div>
                        </div>
                        <div className="col-8 col-md-6">
                            <div className="mb-4 mt-4 middle-container row justify-content-between">
                                <div className="col-6 col-md-3 mb-3">
                                    <div className="footer-links">
                                        <Link to="/franchises">Popular Franchises</Link>
                                        <Link to="/user-profile#Resources">Resources</Link>
                                        <Link to="/user-profile#Events">Events</Link>
                                        <Link to="/user-profile#Blogs">Blogs</Link>
                                        <Link to="#">FDDs</Link>
                                    </div>
                                </div>
                                <div className="col-6 col-md-3 mb-3">
                                    <div className="footer-links">
                                        <Link to="/franchises">Top Franchises</Link>
                                        <Link to="#">Consultants</Link>
                                        <Link to="/franchise-profile#Testimonials">Testimonials</Link>
                                        <Link to="/community">Community</Link>
                                    </div>
                                </div>
                                <div className="col-6 col-md-3 mb-3">
                                    <div className="footer-links ">
                                        <Link to="/terms-and-conditions">Terms & Conditions</Link>
                                        <Link to="/privacy-policy">Privacy Policy</Link>
                                    </div>
                                </div>
                                <div className="col-6 col-md-3 mb-3">
                                    <div className="footer-links">
                                        <Link to="/contact">Contact Us</Link>
                                        <Link to="/help">Help</Link>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div className="col-12 col-md-3 ">
                            <div className="text-center">
                                <div className="contact-box mt-4">
                                    <h6 className="mb-3">Connect with Us</h6>
                                    <button>Subscribe to our News Letter</button>
                                </div>
                                <div className="social-icons mt-3">
                                    {/* Note: Icons paths might need adjustment if using different assets, assuming they are in public/assets */}
                                    <img src="/assets/images/icons/social-media/facebook-icon.png" alt="facebook" />
                                    <img src="/assets/images/icons/social-media/twitter-icon.png" alt="twitter" />
                                    <img src="/assets/images/icons/social-media/mail-icon.png" alt="mail" />
                                    <img src="/assets/images/icons/social-media/linkedin-icon.png" alt="linkedin" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="text-center copy-right pb-2">© {new Date().getFullYear()} Franchise Community Portal</div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
