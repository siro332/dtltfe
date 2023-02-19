import React, { useContext, useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { PATH } from "../../constants/API";
import { CartContext } from "../helpers/context/cart-context";
import { SearchContext } from "../helpers/context/search-context";
import { AuthContext } from "../helpers/context/auth-context";
function Header({ categories }) {
    const [userCart, setUserCart] = useState(undefined);
    const [deletingItem, setDeletingItem] = useState(-1);
    const [searchParam, setSearchParam] = useState("");
    const cartContext = useContext(CartContext);
    const authContext = useContext(AuthContext);
    const searchContext = useContext(SearchContext);
    const location = useLocation();
    const navigate = useNavigate();
    const [categoryCode, setCategoryCode] = useState("All")
    useEffect(
        () => {
            async function getUserInfo() {
                try {
                    if (authContext.isAuthenticated) {
                        const token = 'Bearer ' + localStorage.getItem("token")
                        const response = await axios.get(PATH.API_ROOT_URL + PATH.API_ORDER + "/cart/user", {
                            headers: {
                                'Authorization': token
                            }
                        });
                        setUserCart(response.data)
                    }
                } catch (error) {
                    console.error(error.message)
                }
            }
            getUserInfo()
        }
        , [authContext.isAuthenticated, cartContext])

    useEffect(
        () => {
            async function deleteItem() {
                try {
                    if (deletingItem > -1) {
                        await axios.post(PATH.API_ROOT_URL + PATH.API_ORDER + "/cart/deleteItem", {
                            productCode: userCart.cartItemDtos[deletingItem].productDto.code,
                            productInventory: userCart.cartItemDtos[deletingItem].inventoryItem.sku,
                            units: userCart.cartItemDtos[deletingItem].units
                        }, {
                            headers: {
                                'Authorization': 'Bearer ' + localStorage.getItem("token")
                            }
                        });
                        const temp = userCart;
                        temp.cartItemDtos.splice(deletingItem, 1)
                        setUserCart(temp)
                    }
                    setDeletingItem(-1)
                } catch (error) {
                    console.error(error.message)
                }
            }
            deleteItem()
        }
        , [deletingItem, userCart])

    const getInputValue = (event) => {
        // show the user input value to console
        setSearchParam(event.target.value)
    };
    useEffect(
        () => {
            async function setSearch() {
            }
            setSearch();
        }, [searchParam]);

    const handleSearch = () => {
        const path = location.pathname.split("/")[1];
        (searchContext.search)(searchParam)
        if ((path !== "search" && path !== "category") || categoryCode ==="All") {
            navigate("/search", { replace: true });
        }else if (categoryCode !=="All"){
            navigate("/category/"+categoryCode, { replace: true });
        }
    }
    const handleRemoveCartItem = (index) => {
        setDeletingItem(index)
    }
    const handleSelect = (e) => { 
        console.log(e.target.value)
        setCategoryCode(e.target.value); 
    }
    return (
        <header>
            {/* TOP HEADER */}
            <div id="top-header">
                <div className="container">
                    <ul className="header-links pull-left">
                        <li><a href="#"><i className="fa fa-phone" /> +84-123-123-123</a></li>
                        <li><a href="#"><i className="fa fa-envelope-o" /> email@email.com</a></li>
                        <li><a href="#"><i className="fa fa-map-marker" /> Thái Nguyên</a></li>
                    </ul>
                    <ul className="header-links pull-right">
                        {!authContext.isAuthenticated ? <li>
                            <NavLink to="/login">Đăng nhập/Đăng ký</NavLink>
                        </li> :
                            <li>
                                <NavLink to="/dashboard"><i className="fa fa-user-o" /> Xin chào {localStorage.getItem("lastname") + " " + localStorage.getItem("firstname")}</NavLink>!
                                <a href="#" onClick={authContext.logout}> Đăng xuất</a>
                            </li>
                        }
                    </ul>
                </div>
            </div>
            {/* /TOP HEADER */}
            {/* MAIN HEADER */}
            <div id="header">
                {/* container */}
                <div className="container">
                    {/* row */}
                    <div className="row">
                        {/* LOGO */}
                        <div className="col-md-3">
                            <div className="header-logo">
                                <NavLink className="logo" to="/">
                                    <img src="./assets/img/logo.png" alt="" />
                                </NavLink>
                            </div>
                        </div>
                        {/* /LOGO */}
                        {/* SEARCH BAR */}
                        <div className="col-md-6">
                            <div className="header-search">
                                <form>
                                <select className="input-select" value={categoryCode} onChange={(e) =>handleSelect(e)}>
										<option value="All">Chọn loại hàng</option>
										{categories.map((item) =>(
                                            <option value={item.code}>{item.name}</option>
                                            
                                        ))}
                                </select>
                                    <input className="input" placeholder="Nhập sản phẩm bạn muốn tìm" onChange={getInputValue} />
                                    <button type="button" className="search-btn" onClick={() => handleSearch()}>Tìm kiếm</button>
                                </form>
                            </div>
                        </div>
                        {/* /SEARCH BAR */}
                        {/* ACCOUNT */}
                        <div className="col-md-3 clearfix">
                            <div className="header-ctn">
                                {userCart &&
                                    <div className="dropdown ">
                                        <NavLink to={"/cart"} className="dropdown-toggle" data-toggle="dropdown" aria-expanded="true" aria-haspopup="true" role="button" data-display="static">
                                            <i className="fa fa-shopping-cart" />
                                            <span>Giỏ hàng</span>
                                            {userCart.cartItemDtos.length > 0 &&
                                                <div className="qty">{userCart.cartItemDtos.length}</div>
                                            }
                                        </NavLink>
                                        {/* {userCart.cartItemDtos.length > 0 &&
                                            <div className="cart-dropdown">
                                                <div className="cart-list">
                                                    {userCart.cartItemDtos.map((item, index) => (
                                                        <div className="product-widget">
                                                            <div className="product-img">
                                                            {item.productDto.mediaList != null && item.productDto.mediaList.length > 0 &&
                                                                        <img src={item.productDto.mediaList[0].imgUrl} alt={item.productDto.mediaList[0].altText} />}
                                                            </div>
                                                            <div className="product-body">
                                                                <h3 className="product-name"><NavLink to={"/product/" + item.productDto.code}>{item.productDto.name}</NavLink></h3>
                                                                <h4 className="product-price"><span className="qty">{item.units}x</span>{item.inventoryItem.retailPrice} VND</h4>
                                                            </div>

                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="cart-summary">
                                                    <h5>Tổng cộng: {userCart.totals} VNĐ</h5>
                                                </div>
                                                <div className="cart-btns">
                                                    <NavLink to={"/cart"} className="btn btn-primary">Xem giỏ hàng</NavLink>
                                                    <NavLink to={"/checkout"} className="btn btn-outline-primary-2">Đặt hàng<i className="fa fa-arrow-circle-right" /></NavLink>
                                                </div>
                                            </div>
                                        } */}

                                    </div>
                                }
                            </div>
                        </div>
                        {/* /ACCOUNT */}
                    </div>
                    {/* row */}
                </div>
                {/* container */}
            </div>
            {/* /MAIN HEADER */}
        </header>)
}
export default Header;