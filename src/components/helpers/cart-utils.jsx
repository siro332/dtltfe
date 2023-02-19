
import { Navigate } from 'react-router-dom';
const CartUtils = ({ children }) => {

 const isLoggedIn = false;

 return isLoggedIn ? children : <Navigate to={{ pathname: '/', }} />
};

export default CartUtils;
