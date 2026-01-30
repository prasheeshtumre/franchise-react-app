import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
    const { user, logout } = useAuth();

    return (
        <div className="container mt-5">
            <h1>Dashboard</h1>
            <p>Welcome, {user?.first_name || 'User'}!</p>
            <button className="btn btn-danger" onClick={logout}>Logout</button>
        </div>
    );
};

export default Dashboard;
