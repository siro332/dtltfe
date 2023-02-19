import { React, useState, useEffect, useContext } from "react"
import axios from 'axios';
import { NavLink, useParams } from "react-router-dom";
import { PATH } from "../../constants/API"
import Header from "../common/header";
import CategoryProduct from "../home/components/categoryProduct";
import { SearchContext } from "../helpers/context/search-context";
import { CartContext } from "../helpers/context/cart-context";
import { AuthContext } from "../helpers/context/auth-context";
function Dashboard() {
    const [orders, setOrders] = useState([]);
    const [userAddressForm,setUserAddressForm] = useState({
        name: "",
        address: "",
        city:"",
        district:"",
        zipcode: "",
        phoneNumber:"",
        email:""
    })
    const authContext = useContext(AuthContext);
    const handleNameInputChange = (event) => {
        event.persist();
        setUserAddressForm((userAddressForm) => ({
          ...userAddressForm,
          name: event.target.value,
        }));
      };
      const handleAddressInputChange = (event) => {
        event.persist();
        setUserAddressForm((userAddressForm) => ({
          ...userAddressForm,
          address: event.target.value,
        }));
      };
      const handleCityInputChange = (event) => {
        event.persist();
        setUserAddressForm((userAddressForm) => ({
          ...userAddressForm,
          city: event.target.value,
        }));
      };
      const handleDistricInputChange = (event) => {
        event.persist();
        setUserAddressForm((userAddressForm) => ({
          ...userAddressForm,
          district: event.target.value,
        }));
      };
      const handleZipCodeInputChange = (event) => {
        event.persist();
        setUserAddressForm((userAddressForm) => ({
          ...userAddressForm,
          zipcode: event.target.value,
        }));
      };
      const handlePhoneNumberInputChange = (event) => {
        event.persist();
        setUserAddressForm((userAddressForm) => ({
          ...userAddressForm,
          phoneNumber: event.target.value,
        }));
      };
      const handleEmailInputChange = (event) => {
        event.persist();
        setUserAddressForm((userAddressForm) => ({
          ...userAddressForm,
          email: event.target.value,
        }));
      };
      const submitForm = async () => {
        console.log(userAddressForm)
        try {
          await axios.post(PATH.API_ROOT_URL + PATH.API_USER + "/info/add", {
            name: userAddressForm.name,
        address: userAddressForm.address,
        district: userAddressForm.district,
        city: userAddressForm.city,
        zipcode: userAddressForm.zipcode,
        phoneNumber:userAddressForm.phoneNumber,
        email:userAddressForm.email
        }, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("token")
            }
        });
        } catch (error) {
          console.log(error)
        }
    }
    useEffect(
        () => {
            // async function getUserInfo() {
            //     try {
            //         if (keycloak.authenticated) {
            //             const token = 'Bearer ' + keycloak.token
            //             const response = await axios.get(PATH.API_ROOT_URL + PATH.API_USER + "/info/", {
            //                 headers: {
            //                     'Authorization': token
            //                 }
            //             });
            //             console.log(response.data)
            //             const addressform = {
            //                 name: response.name!=null?response.name:"",
            //                     address: response.address!=null?response.address:"",
            //                     city: response.city!=null?response.city:"",
            //                     district: response.district!=null?response.district:"",
            //                     zipcode: response.zipcode!=null?response.zipcode:"",
            //                     phoneNumber: response.phoneNumber!=null?response.phoneNumber:"",
            //                     email: response.email!=null?response.email:""
            //             }
            //             setUserAddressForm(addressform)
            //         }
            //     } catch (error) {
            //         console.error(error.message)
            //     }
            // }
            // getUserInfo()
        }
        , [])

    useEffect(
        () => {
            async function getUserOrder() {
                try {
                    if (authContext.isAuthenticated) {
                        const token = 'Bearer ' + localStorage.getItem("token")
                        const response = await axios.get(PATH.API_ROOT_URL + PATH.API_ORDER + "/order/user", {
                            headers: {
                                'Authorization': token
                            }
                        });
                        console.log(response.data)
                        setOrders(response.data)
                        // const tempcart = [];
                        // response.data.cartItemDtos.forEach(item => {
                        //   tempcart.push({
                        //     productCode: item.productDto.code,
                        //     productInventory: item.inventoryItem.sku,
                        //     units: item.units
                        //   })
                        // });
                        // setCartForm(tempcart)

                        // console.log(tempcart)
                    }
                } catch (error) {
                    console.error(error.message)
                }
            }
            getUserOrder()
        }
        , [authContext.isAuthenticated])


    const handleCancel = async (code) =>{
        try {
            await axios.post(PATH.API_ROOT_URL + PATH.API_ORDER + "/order/change-status/"+ code, {}, {
              params: {status: "canceled"},  
              headers: {
                  'Authorization': 'Bearer ' + localStorage.getItem("token")
              }
          });
          
          alert("Huỷ đơn hàng thành công")
          } catch (error) {
            console.log(error)
          }
    }    
    return (

        <div className="page-wrapper">

            <main className="main">
                <div className="page-header text-center" style={{ backgroundImage: 'url("assets/images/page-header-bg.jpg")' }}>
                    <div className="container">
                        <h1 className="page-title">Tài khoản của tôi<span></span></h1>
                    </div>{/* End .container */}
                </div>{/* End .page-header */}
                <nav aria-label="breadcrumb" className="breadcrumb-nav mb-3">
                    <div className="container">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><NavLink to={"/"}>Trang chủ</NavLink></li>
                            <li className="breadcrumb-item active" aria-current="page">Tài khoản</li>
                        </ol>
                    </div>{/* End .container */}
                </nav>{/* End .breadcrumb-nav */}
                <div className="page-content">
                    <div className="dashboard">
                        <div className="container">
                            <div className="row">
                                <aside className="col-md-4 col-lg-3">
                                    <ul className="nav nav-dashboard flex-column mb-3 mb-md-0" role="tablist">
                                        <li className="nav-item">
                                            <a className="nav-link active" id="tab-dashboard-link" data-toggle="tab" href="#tab-dashboard" role="tab" aria-controls="tab-dashboard" aria-selected="true">Thông tin tài khoản</a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="nav-link" id="tab-orders-link" data-toggle="tab" href="#tab-orders" role="tab" aria-controls="tab-orders" aria-selected="false">Đơn hàng</a>
                                        </li>

                                        <li className="nav-item">
                                            <a className="nav-link" id="tab-account-link" data-toggle="tab" href="#tab-account" role="tab" aria-controls="tab-account" aria-selected="false">Thông tin nhận hàng</a>
                                        </li>
                                        <li className="nav-item">
                                            {/* <a className="nav-link" href="#" onClick={keycloak.logout}>Đăng xuất</a> */}
                                        </li>
                                    </ul>
                                </aside>{/* End .col-lg-3 */}
                                <div className="col-md-8 col-lg-9">
                                    <div className="tab-content">
                                        <div className="tab-pane fade show active" id="tab-dashboard" role="tabpanel" aria-labelledby="tab-dashboard-link">
                                            {/* <p>Xin chào <span className="font-weight-normal text-dark">{keycloak.tokenParsed.name}!</span> (không phải <span className="font-weight-normal text-dark">{keycloak.tokenParsed.name}!</span>? <a href="#" onClick={keycloak.logout}>Đăng xuất</a>) */}
                                                <br />
                                                {/* Thay đổi thông tin đăng nhập <a href="#" onClick={keycloak.accountManagement}>tại đây</a>.</p> */}
                                        </div>{/* .End .tab-pane */}
                                        <div className="tab-pane fade" id="tab-orders" role="tabpanel" aria-labelledby="tab-orders-link">
                                            {orders.length > 0 ? <div>
                                                <div className="accordion" id="accordion-1">
                                                    {orders.map((item, index) => (
                                                        <div className="card">
                                                            <div className="card-header" id={index}>
                                                                <p className="card-title">
                                                                    <a role="button" data-toggle="collapse" href={"#collapse-" + index} aria-expanded="true" aria-controls={"collapse-" + index}>
                                                                        Đơn hàng #{item.code}
                                                                    </a>
                                                                </p>
                                                            </div>{/* End .card-header */}
                                                            <div id={"collapse-" + index} className="collapse" aria-labelledby={index} data-parent="#accordion-1">
                                                                <div className="card-body">
                                                                    <p>
                                                                        Họ tên người nhận: {item.name}
                                                                        <br></br>Địa chỉ giao hàng: {item.address}
                                                                        <br></br>Số điện thoại: {item.phoneNumber}
                                                                        <br></br>Địa chỉ email: {item.email}
                                                                        <br></br>Phương thức thanh toán: {item.paymentMethod}
                                                                        <br></br>Ghi chú: {item.note}
                                                                        <br></br>Trạng thái: {item.status}
                                                                    </p>
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
                                                                            {item?.cartItems?.map((product, index) => (
                                                                                <tr>
                                                                                    <td className="product-col">
                                                                                        <div className="product">
                                                                                            <figure className="product-media">
                                                                                                <NavLink to={"/product/" + product.productDto.code} >
                                                                                                    <img src={product.productDto.mediaList[0].imgUrl} alt={product.productDto.mediaList[0].altText} />
                                                                                                </NavLink>
                                                                                            </figure>
                                                                                            <h3 className="product-title">
                                                                                                <NavLink to={"/product/" + product.productDto.code} >{product.productDto.name + " " + product.inventoryItem.productAttributeValues.reduce((string, current) => string += current.attributeValue + " ", "")}</NavLink>
                                                                                            </h3>{/* End .product-title */}
                                                                                        </div>{/* End .product */}
                                                                                    </td>
                                                                                    <td className="price-col">{product.inventoryItem.retailPrice} VNĐ</td>
                                                                                    <td className="quantity-col">
                                                                                        {product.units}
                                                                                    </td>
                                                                                    <td className="total-col">{product.inventoryItem.retailPrice * product.units} VNĐ</td>
                                                                                </tr>))}
                                                                        </tbody>
                                                                    </table>
                                                                    <div className="cart-bottom">
                                                                    {item.status === "delivered"?<div></div>:<button type="button" className="btn btn-outline-dark-2" onClick={() => handleCancel(item.code)}><span>Huỷ đơn hàng</span></button>}
                </div>
                                                                </div>{/* End .card-body */}
                                                            </div>{/* End .collapse */}
                                                        </div>
                                                    ))}
                                                </div>

                                            </div> : <div><p>Bạn chưa đặt đơn hàng nào.</p>
                                                <NavLink to={"/"} className="btn btn-outline-primary-2"><span>ĐẶT HÀNG</span><i className="icon-long-arrow-right" /></NavLink></div>}
                                        </div>{/* .End .tab-pane */}

                                        <div className="tab-pane fade" id="tab-address" role="tabpanel" aria-labelledby="tab-address-link">
                                            <p>Địa chỉ bên dưới sẽ được sử dụng .</p>
                                            <div className="row">
                                                <div className="col-lg-6">
                                                    <div className="card card-dashboard">
                                                        <div className="card-body">
                                                            <h3 className="card-title">Billing Address</h3>{/* End .card-title */}
                                                            <p>User Name<br />
                                                                User Company<br />
                                                                John str<br />
                                                                New York, NY 10001<br />
                                                                1-234-987-6543<br />
                                                                yourmail@mail.com<br />
                                                                <a href="#">Edit <i className="icon-edit" /></a></p>
                                                        </div>{/* End .card-body */}
                                                    </div>{/* End .card-dashboard */}
                                                </div>{/* End .col-lg-6 */}
                                                <div className="col-lg-6">
                                                    <div className="card card-dashboard">
                                                        <div className="card-body">
                                                            <h3 className="card-title">Shipping Address</h3>{/* End .card-title */}
                                                            <p>You have not set up this type of address yet.<br />
                                                                <a href="#">Edit <i className="icon-edit" /></a></p>
                                                        </div>{/* End .card-body */}
                                                    </div>{/* End .card-dashboard */}
                                                </div>{/* End .col-lg-6 */}
                                            </div>{/* End .row */}
                                        </div>{/* .End .tab-pane */}
                                        <div className="tab-pane fade" id="tab-account" role="tabpanel" aria-labelledby="tab-account-link">
                                        <form onSubmit={() => submitForm()}>
                                            <div className="row">
                                            <div className="col-lg-9">
                                                <h2 className="checkout-title">Thông tin nhận hàng</h2>{/* End .checkout-title */}
                                                <label>Họ tên người nhận hàng *</label>
                                                <input type="text" className="form-control" placeholder="Họ tên" required value={userAddressForm.name} onChange={handleNameInputChange}/>
                                                <label>Địa chỉ *</label>
                                                <input type="text" className="form-control" placeholder="Số nhà, tên đường" required value={userAddressForm.address} onChange={handleAddressInputChange}/>
                                                <div className="row">
                                                <div className="col-sm-6">
                                                    <label>Tỉnh / Thành Phố *</label>
                                                    <input type="text" className="form-control" required value={userAddressForm.city} onChange={handleCityInputChange}/>
                                                </div>{/* End .col-sm-6 */}
                                                <div className="col-sm-6">
                                                    <label>Quận / Thị Xã*</label>
                                                    <input type="text" className="form-control" required value={userAddressForm.district} onChange={handleDistricInputChange}/>
                                                </div>{/* End .col-sm-6 */}
                                                </div>{/* End .row */}
                                                <div className="row">
                                                <div className="col-sm-6">
                                                    <label>Mã ZIP *</label>
                                                    <input type="text" className="form-control" required value={userAddressForm.zipcode} onChange={handleZipCodeInputChange}/>
                                                </div>{/* End .col-sm-6 */}
                                                <div className="col-sm-6">
                                                    <label>Số điện thoại *</label>
                                                    <input type="tel" className="form-control" required value={userAddressForm.phoneNumber} onChange={handlePhoneNumberInputChange}/>
                                                </div>{/* End .col-sm-6 */}
                                                </div>{/* End .row */}
                                                <label>Địa chỉ email *</label>
                                                <input type="email" className="form-control" required value={userAddressForm.email} onChange={handleEmailInputChange}/>                                           
                                            </div>{/* End .col-lg-9 */}                                           
                                            </div>{/* End .row */}
                                            <button type="submit" className="btn btn-outline-primary-2">
			                					<span>Lưu thay đổi</span>
			            						<i className="icon-long-arrow-right"></i>
			                				</button>
                                        </form>
                                        </div>{/* .End .tab-pane */}
                                    </div>
                                </div>{/* End .col-lg-9 */}
                            </div>{/* End .row */}
                        </div>{/* End .container */}
                    </div>{/* End .dashboard */}
                </div>{/* End .page-content */}
            </main>{/* End .main */}
        </div>
    );
}
export default Dashboard