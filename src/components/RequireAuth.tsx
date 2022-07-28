import { Navigate } from 'react-router-dom';


const RequireAuth = ({ children, user }: any) => {

    if (user) {
        return children;
    } else {
        return <Navigate to="/" replace />
    }

}

export default RequireAuth