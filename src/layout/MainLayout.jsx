import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import UserHeader from '../components/UserHeader';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import './MainLayout.css';

const MainLayout = () => {
    const { user } = useAuth();

    return (
        <div className="fb-layout">
            <div className="fb-header-wrapper">
                {user ? <UserHeader /> : <Header />}
            </div>
            <div className="fb-main-wrapper">
                <main className="fb-content-container">
                    <Outlet />
                </main>
                <Footer />
            </div>
        </div>
    );
};

export default MainLayout;
