import {createContext ,useState} from "react";


const SearchContext = createContext();

function SearchContextProvider({children}){
    const [searchParam,setSearchParam] = useState("")
    const search = (param) => {
        setSearchParam(param);
        console.log(param)
    }
    const value = {searchParam,search}

    return (
        <SearchContext.Provider value={value}>
            {children}
        </SearchContext.Provider>
    )
}
export {SearchContext,SearchContextProvider}