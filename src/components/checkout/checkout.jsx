import React, { useContext, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { PATH } from "../../constants/API";
import { CartContext } from "../helpers/context/cart-context";
import { Simplert } from "react-simplert";
import { AuthContext } from "../helpers/context/auth-context";
function Checkout() {

  const [userCart, setUserCart] = useState(undefined);
  const [deletingItem, setDeletingItem] = useState(-1)
  const cartContext = useContext(CartContext)
  const authContext = useContext(AuthContext)
  const [orderSubmited, setOrderSubmited] = useState(false);

  const navigate = useNavigate();
  const [orderForm, setOrderForm] = useState({
    name: "",
    address: "",
    city: "",
    distric: "",
    zipCode: "",
    phoneNumber: "",
    email: "",
    note: "",
    paymentMethod: "cod",
    isPaid: ""
  })

  const handleNameInputChange = (event) => {
    event.persist();
    setOrderForm((orderForm) => ({
      ...orderForm,
      name: event.target.value,
    }));
  };
  const handleAddressInputChange = (event) => {
    event.persist();
    setOrderForm((orderForm) => ({
      ...orderForm,
      address: event.target.value,
    }));
  };
  const handleCityInputChange = (event) => {
    event.persist();
    setOrderForm((orderForm) => ({
      ...orderForm,
      city: event.target.value,
    }));
  };
  const handleDistricInputChange = (event) => {
    event.persist();
    setOrderForm((orderForm) => ({
      ...orderForm,
      distric: event.target.value,
    }));
  };
  const handleZipCodeInputChange = (event) => {
    event.persist();
    setOrderForm((orderForm) => ({
      ...orderForm,
      zipCode: event.target.value,
    }));
  };
  const handlePhoneNumberInputChange = (event) => {
    event.persist();
    setOrderForm((orderForm) => ({
      ...orderForm,
      phoneNumber: event.target.value,
    }));
  };
  const handleNoteInputChange = (event) => {
    event.persist();
    setOrderForm((orderForm) => ({
      ...orderForm,
      note: event.target.value,
    }));
  };
  const handleEmailInputChange = (event) => {
    event.persist();
    setOrderForm((orderForm) => ({
      ...orderForm,
      email: event.target.value,
    }));
  };
  const handlePaymentInputChange = (event, value) => {
    console.log(event)
    event.persist();
    setOrderForm((orderForm) => ({
      ...orderForm,
      paymentMethod: value,
    }));
  };
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
          console.log(deletingItem)
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


  const handleRemoveCartItem = (index) => {
    setDeletingItem(index)
  }
  const submitForm = async () => {
    console.log(orderForm)
    try {
      await axios.post(PATH.API_ROOT_URL + PATH.API_ORDER + "/order/create", {
        name: orderForm.name,
        address: orderForm.address + ", " + orderForm.distric + ", " + orderForm.city,

        zipCode: orderForm.zipCode,
        phoneNumber: orderForm.phoneNumber,
        email: orderForm.email,
        note: orderForm.note,
        paymentMethod: orderForm.paymentMethod,
        isPaid: orderForm.paymentMethod !== "cod" ? true : false
      }, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem("token")
        }
      });
      setOrderSubmited(true)
      alert("??????t ha??ng tha??nh c??ng")
    } catch (error) {

    }

  }
  useEffect(() => {
    async function redirect() {
      try {
        if (orderSubmited) {
          (cartContext.toggleCartReload)()
          navigate("/")
        }
      } catch (error) {
        console.error(error.message)
      }
    }
    redirect();
  }
    , [cartContext, navigate, orderSubmited])
  return (
    userCart ?
      <div>

        <div className="page-wrapper">
          <main className="main">
            <div className="page-header text-center" style={{ backgroundImage: 'url("assets/images/page-header-bg.jpg")' }}>
              <div className="container">
                <h1 className="page-title">?????t H??ng</h1>
              </div>{/* End .container */}
            </div>{/* End .page-header */}
            <nav aria-label="breadcrumb" className="breadcrumb-nav">
              <div className="container">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item"><NavLink to="/" >Trang ch???</NavLink></li>
                  <li className="breadcrumb-item active" aria-current="page">?????t H??ng</li>
                </ol>
              </div>{/* End .container */}
            </nav>{/* End .breadcrumb-nav */}
            <div className="page-content">
              <div className="checkout">
                <div className="container">
                  <div className="checkout-discount">
                  </div>
                  <form onSubmit={() => submitForm()}>
                    <div className="row">
                      <div className="col-lg-9">
                        <h2 className="checkout-title">Th??ng tin ????n h??ng</h2>{/* End .checkout-title */}
                        <label>H??? t??n ng?????i nh???n h??ng *</label>
                        <input type="text" className="form-control" placeholder="H??? t??n" required value={orderForm.name} onChange={handleNameInputChange} />
                        <label>?????a ch??? *</label>
                        <input type="text" className="form-control" placeholder="S??? nh??, t??n ???????ng" required value={orderForm.address} onChange={handleAddressInputChange} />
                        <div className="row">
                          <div className="col-sm-6">
                            <label>T???nh / Th??nh Ph??? *</label>
                            <input type="text" className="form-control" required value={orderForm.city} onChange={handleCityInputChange} />
                          </div>{/* End .col-sm-6 */}
                          <div className="col-sm-6">
                            <label>Qu???n / Th??? X??*</label>
                            <input type="text" className="form-control" required value={orderForm.distric} onChange={handleDistricInputChange} />
                          </div>{/* End .col-sm-6 */}
                        </div>{/* End .row */}
                        <div className="row">
                          <div className="col-sm-6">
                            <label>M?? ZIP *</label>
                            <input type="text" className="form-control" required value={orderForm.zipCode} onChange={handleZipCodeInputChange} />
                          </div>{/* End .col-sm-6 */}
                          <div className="col-sm-6">
                            <label>S??? ??i???n tho???i *</label>
                            <input type="tel" className="form-control" required value={orderForm.phoneNumber} onChange={handlePhoneNumberInputChange} />
                          </div>{/* End .col-sm-6 */}
                        </div>{/* End .row */}
                        <label>?????a ch??? email *</label>
                        <input type="email" className="form-control" required value={orderForm.email} onChange={handleEmailInputChange} />
                        <label>Ghi ch??</label>
                        <textarea className="form-control" cols={30} rows={4} placeholder="Th???i gian giao h??ng, n??i giao h??ng,..." defaultValue={""} value={orderForm.note} onChange={handleNoteInputChange} />
                      </div>{/* End .col-lg-9 */}
                      <aside className="col-lg-3">
                        <div className="summary">
                          <h3 className="summary-title">????n h??ng c???a b???n</h3>{/* End .summary-title */}
                          <table className="table table-summary">
                            <thead>
                              <tr>
                                <th>S???n Ph???m</th>
                                <th>T???ng c???ng</th>
                              </tr>
                            </thead>
                            <tbody>
                              {userCart.cartItemDtos.map((item, index) => (
                                <tr>
                                  <td>

                                    <NavLink to={"/product/" + item.productDto.code} >{item.productDto.name + " " + item.inventoryItem.productAttributeValues.reduce((string, current) => string += current.attributeValue + " ", "")}</NavLink>
                                  </td>
                                  <td >{item.inventoryItem.retailPrice * item.units} VN??</td>
                                </tr>))}

                              <tr>
                                <td>V???n chuy???n:</td>
                                <td>Mi???n ph??</td>
                              </tr>
                              <tr className="summary-total">
                                <td>T???ng c???ng:</td>
                                <td>{userCart.totals}</td>
                              </tr>{/* End .summary-total */}
                            </tbody>
                          </table>{/* End .table table-summary */}
                          <div className="accordion-summary" id="accordion-payment">
                            <div className="payment-method">
                              <div className="input-radio">
                                <input type="radio" name="payment" id="payment-1" onClick={(e) => handlePaymentInputChange(e, "direct transfer")} />
                                <label htmlFor="payment-1">
                                  <span />
                                  Chuy????n khoa??n tr????c ti????p
                                </label>
                                <div className="caption">
                                  <p>Chuy???n kho???n v??o t??i kho???n ng??n h??ng c???a ch??ng t??i.</p>
                                </div>
                              </div>
                              <div className="input-radio">
                                <input type="radio" name="payment" id="payment-2" onClick={(e) => handlePaymentInputChange(e, "cod")} />
                                <label htmlFor="payment-2">
                                  <span />
                                  Tr??? ti???n khi nh???n h??ng
                                </label>
                                <div className="caption">
                                  <p>B???n s??? tr??? ti???n khi ????n h??ng ???????c giao ?????n b???n.</p>
                                </div>
                              </div>
                            </div>
                          </div>{/* End .accordion */}
                          <button type="button" onClick={submitForm} className="btn btn-outline-primary-2 btn-order btn-block">
                            <span className="btn-text">?????t h??ng</span>

                          </button>
                        </div>{/* End .summary */}
                      </aside>{/* End .col-lg-3 */}
                    </div>{/* End .row */}
                  </form>
                </div>{/* End .container */}
              </div>{/* End .checkout */}
            </div>{/* End .page-content */}
          </main>{/* End .main */}
        </div>{/* End .page-wrapper */}
        <button id="scroll-top" title="Back to Top"><i className="icon-arrow-up" /></button>
      </div>
      : <div></div>)
}
export default Checkout;