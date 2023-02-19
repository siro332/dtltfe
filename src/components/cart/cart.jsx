import { React, useState, useEffect, useContext } from "react"
import axios from 'axios';
import { NavLink, useParams } from "react-router-dom";
import { PATH } from "../../constants/API"
import Header from "../common/header";
import CategoryProduct from "../home/components/categoryProduct";
import { SearchContext } from "../helpers/context/search-context";
import { CartContext } from "../helpers/context/cart-context";
import { AuthContext } from "../helpers/context/auth-context";
function Cart() {
  const [userCart, setUserCart] = useState(undefined);
  const [cartForm, setCartForm] = useState([]);
  const [deletingItem, setDeletingItem] = useState(-1);
  const cartContext = useContext(CartContext);
  const authContext = useContext(AuthContext);
  useEffect(
    () => {
      async function getUserInfo() {
        try {
          if (authContext.isAuthenticated) {
            const token = 'Bearer ' + localStorage.getItem("token")
            console.log(token)
            const response = await axios.get(PATH.API_ROOT_URL + PATH.API_ORDER + "/cart/user", {
              headers: {
                'Authorization': token
              }
            });
            console.log(response.data)
            setUserCart(response.data)
            const tempcart = [];
            response.data.cartItemDtos.forEach(item => {
              tempcart.push({
                productCode: item.productDto.code,
                productInventory: item.inventoryItem.sku,
                units: item.units
              })
            });
            setCartForm(tempcart)
            
            console.log(tempcart)
          }
        } catch (error) {
          console.error(error.message)
        }
      }
      getUserInfo()
    }
    , [cartContext])

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
            const tempcart = [];
            temp.cartItemDtos.forEach(item => {
              tempcart.push({
                productCode: item.productDto.code,
                productInventory: item.inventoryItem.sku,
                units: item.units
              })
            });
            setCartForm(tempcart)
          }
          setDeletingItem(-1);
          (cartContext.toggleCartReload)()          
        } catch (error) {
          console.error(error.message)
        }
      }
      deleteItem()
    }
    , [])
  const handleRemoveCartItem = (index) => {
      setDeletingItem(index)
      
  }
  const handleReloadCart = async () => {   
    await axios.post(PATH.API_ROOT_URL + PATH.API_ORDER + "/cart/updateCart", 
      cartForm
    , {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem("token")
      }
    });
    (cartContext.toggleCartReload)()
  }
  
  const handleUnits = (e,index) => {
    cartForm[index].units = e.target.value;
    setCartForm(cartForm)
  }
  useEffect(
    () => {
        async function reloadCart() {
        }
        reloadCart();
    }, [cartForm]);
  return (
    userCart && cartForm.length>0?
    <div className="main">
      <div className="page-header text-center" style={{ backgroundImage: 'url("assets/images/page-header-bg.jpg")' }}>
        <div className="container">
          <h1 className="page-title">GIỎ HÀNG</h1>
        </div>{/* End .container */}
      </div>{/* End .page-header */}
      <div className="page-content">
        <div className="cart">
          <div className="container">
            <div className="row">
              <div className="col-lg-9">
                <table className="table table-cart table-mobile">
                  <thead>
                    <tr>
                      <th>Sản phẩm</th>
                      <th>Giá</th>
                      <th>Số lượng</th>
                      <th>Tổng cộng</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {userCart.cartItemDtos.map((item,index) => (
                    <tr>
                      <td className="product-col">
                        <div className="product">
                          <figure className="product-img">
                            <NavLink to={"/product/"+item.productDto.code} >
                              <img src={item.productDto.mediaList[0].imgUrl} alt={item.productDto.mediaList[0].altText} style={{maxWidth:100, maxHeight:100}}/>
                            </NavLink>
                          </figure>
                          <h3 className="product-title">
                          <NavLink to={"/product/"+item.productDto.code} >{item.productDto.name +" " + item.inventoryItem.productAttributeValues.reduce((string, current) => string += current.attributeValue + " ", "")}</NavLink>
                          </h3>{/* End .product-title */}
                        </div>{/* End .product */}
                      </td>
                      <td className="price-col">{item.inventoryItem.retailPrice} VNĐ</td>
                      <td className="quantity-col">
                        <div className="cart-product-quantity">
                          <input type="number" className="form-control" defaultValue={item.units} min={1} max={item.inventoryItem.units} step={1} data-decimals={0} required onChange={(e) => handleUnits(e,index)}/>
                        </div>{/* End .cart-product-quantity */}
                      </td>
                      <td className="total-col">{item.inventoryItem.retailPrice * cartForm[index].units} VNĐ</td>
                      <td className="remove-col"><button className="btn-remove" onClick={() => handleRemoveCartItem(index)}><i className="icon-close" /></button></td>
                    </tr>))}
                  </tbody>
                </table>{/* End .table table-wishlist */}
                <div className="cart-bottom">
                  <button onClick={() => handleReloadCart()} className="btn btn-outline-dark-2"><span>CẬP NHẬT GIỎ HÀNG</span><i className="icon-refresh" /></button>
                </div>{/* End .cart-bottom */}
              </div>{/* End .col-lg-9 */}
              <aside className="col-lg-3">
                <div className="summary summary-cart">
                  <h3 className="summary-title">Giỏ hàng</h3>{/* End .summary-title */}
                  <table className="table table-summary">
                    <tbody>
                      <tr className="summary-total">
                        <td>Tổng cộng:</td>
                        <td>{userCart.totals} VNĐ</td>
                      </tr>{/* End .summary-total */}
                    </tbody>
                  </table>{/* End .table table-summary */}
                  <NavLink to={"/checkout"} className="btn btn-outline-primary-2 btn-order btn-block">THANH TOÁN</NavLink>
                </div>{/* End .summary */}
                <NavLink to={"/"} className="btn btn-outline-dark-2 btn-block mb-3"><span>Tiếp tục mua hàng</span><i className="icon-refresh" /></NavLink>
              </aside>{/* End .col-lg-3 */}
            </div>{/* End .row */}
          </div>{/* End .container */}
        </div>{/* End .cart */}
      </div>{/* End .page-content */}
    </div>
    :<div></div>
  );
}
export default Cart