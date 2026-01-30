import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'success') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 3000);
    }, []);

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <div className="toast-container position-fixed bottom-0 end-0 p-3" style={{ zIndex: 3000 }}>
                {toasts.map(toast => (
                    <div key={toast.id} className={`toast show align-items-center text-white bg-${toast.type} border-0`} role="alert">
                        <div className="d-flex">
                            <div className="toast-body">{toast.message}</div>
                            <button type="button" className="btn-close btn-close-white me-2 m-auto" onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}></button>
                        </div>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};
