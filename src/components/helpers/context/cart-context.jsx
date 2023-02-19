import {createContext ,useState} from "react";


const CartContext = createContext();

function CartContextProvider({children}){
    const [cartReload,setCartReload] = useState(false)
    const toggleCartReload = () => {
        setCartReload(cartReload === true ? false:true)
    }
    const value = {cartReload,toggleCartReload}

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    )
}
export {CartContext,CartContextProvider}