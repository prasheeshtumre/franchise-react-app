import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import UserHeader from '../components/UserHeader';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';

const MainLayout = () => {
    const { user } = useAuth();

    return (
        <div className="d-flex flex-column min-vh-100">
            {user ? <UserHeader /> : <Header />}
            <main className="flex-grow-1">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default MainLayout;
