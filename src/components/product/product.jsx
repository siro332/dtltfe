import { React, useContext, useEffect, useState } from "react";
import { useNavigate, NavLink, useParams } from "react-router-dom";
import axios from "axios";
import { PATH } from "../../constants/API";
import { CartContext } from "../helpers/context/cart-context";
import CategoryProduct from "../home/components/categoryProduct";
import { AuthContext } from "../helpers/context/auth-context";
function Product() {
    const productCode = useParams();
    const [product, setProduct] = useState(undefined);
    const [allowAddToCart, setAllowAddToCart] = useState(false)
    const [productLoading, setProductLoading] = useState(true);
    const [imageIndex, setImageIndex] = useState(0);
    const [productInventorySku, setProductInventorySku] = useState("");
    const [units, setUnits] = useState(1);

    const context = useContext(CartContext);

    const authContext = useContext(AuthContext);

    const handleProductTypeChange = (e) => {
        if (e.target.value !== "#") {
            setAllowAddToCart(true)
        } else {
            setAllowAddToCart(false)
        }
        setProductInventorySku(e.target.value)
        setUnits(1)

    }
    const handleAddUnits = () => {
        setUnits(units+1)
    }
    const handleSubUnits = () => {
        setUnits(units-1)
    }
    const handleAddToCart = async () => {
        if (authContext.isAuthenticated) {
            if (productInventorySku !== "#") {
                await axios.post(PATH.API_ROOT_URL + PATH.API_ORDER + "/cart/addToCart", {
                    productCode: productCode.id,
                    productInventory: productInventorySku,
                    units: units
                }, {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem("token")
                    }
                });
                (context.toggleCartReload)()
            }
        } else {
            alert("Vui lòng đăng nhập để thêm giỏ hàng")
        }
    }
    useEffect(
        () => {
            async function addToCart() {
            }
            addToCart();
        }, [units, allowAddToCart]);
    useEffect(
        () => {
            async function fetchData() {
                // You can await here
                setProductLoading(true);
                try {
                    const response = await axios.get(PATH.API_ROOT_URL + PATH.API_CATALOG + "/products/product/" + productCode.id);
                    setProduct(response.data);
                    if (response.data.productInventories.length > 0) {
                        setProductInventorySku(response.data.productInventories[0].sku)
                    }
                    console.log(response.data.productInventories[0])
                } catch (error) {
                    console.error(error.message);
                }
                setProductLoading(false);
            }
            fetchData();
        }, [productCode.id]);
    return (
        product ?
            <div>
                <div id="breadcrumb" className="section">
                    {/* container */}
                    <div className="container">
                        {/* row */}
                        <div className="row">
                            <div className="col-md-12">
                                <ul className="breadcrumb-tree">
                                    <li><NavLink to="/" >Trang chủ</NavLink></li>
                                    <li><NavLink to={"/category/" + product?.categories[0].code} >{product?.categories != null ? product?.categories[0].name : ""}</NavLink></li>
                                    <li className="active">{product ? product.name : ""}</li>
                                </ul>
                            </div>
                        </div>
                        {/* /row */}
                    </div>
                    {/* /container */}
                </div>
                {/* /BREADCRUMB */}
                {/* SECTION */}
                <div className="section">
                    {/* container */}
                    <div className="container">
                        {/* row */}
                        <div className="row">
                            {/* Product main img */}
                            <div className="col-md-5 col-md-push-2">
                                <div id="product-main-img">
                                    <div className="product-preview">
                                        <img src={product.mediaList[imageIndex].imgUrl} alt="" />
                                    </div>
                                </div>
                            </div>
                            {/* /Product main img */}
                            {/* Product thumb imgs */}
                            <div className="col-md-2  col-md-pull-5">
                                <div id="product-imgs">
                                    {product?.mediaList?.map((item, index) => (
                                        <div className="product-preview">
                                            <a className="product-preview" onClick={() => setImageIndex(index)} data-image={product?.mediaList[index]?.imgUrl} data-zoom-image={product?.mediaList[index]?.imgUrl}>
                                                <img src={product?.mediaList[index]?.imgUrl} alt="product side" />
                                            </a>

                                        </div>
                                    ))}
                                </div>
                            </div>
                            {/* /Product thumb imgs */}
                            {/* Product details */}
                            <div className="col-md-5">
                                <div className="product-details">
                                    <h2 className="product-name">{product.name}</h2>
                                    {/* <div>
                    <div className="product-rating">
                      <i className="fa fa-star" />
                      <i className="fa fa-star" />
                      <i className="fa fa-star" />
                      <i className="fa fa-star" />
                      <i className="fa fa-star-o" />
                    </div>
                    <a className="review-link" href="#">10 Review(s) | Add your review</a>
                  </div> */}
                                    <div>
                                        <h3 className="product-price">
                                            {product.productInventories.find((inventory) => inventory.sku === productInventorySku) != null ?
                                                product.productInventories.find((inventory) => inventory.sku === productInventorySku).retailPrice + " VND" : "Hết Hàng"}
                                        </h3>
                                    </div>
                                    <p>{product.description}</p>
                                    <div className="product-options">
                                        <label>
                                            Loại hàng
                                            <select name="type" id="type" className="input-select" defaultValue={"#"} onChange={handleProductTypeChange}>
                                                <option value="#" >Chọn loại hàng</option>
                                                {product.productInventories.length > 0 ? product.productInventories.map((item, index) => (
                                                    <option value={item.sku}>{item.productAttributeValues.length > 0 ? item.productAttributeValues.reduce((string, current) => string += current.attributeValue + " ", "") : ""}</option>
                                                )) : <option></option>}
                                            </select>
                                        </label>

                                    </div>
                                    <div className="add-to-cart">
                                        <div className="qty-label">
                                            Số lượng
                                            <div className="input-number">
                                            <input value ={units} type="number" id="qty" className="form-control" defaultValue={1} min={1} max={product.productInventories.find((inventory) => inventory.sku === productInventorySku) != null ?
                                                            product.productInventories.find((inventory) => inventory.sku === productInventorySku).units : 1} step={1} data-decimals={0} required onChange={e => setUnits(e.target.value)} />
                                                <span className="qty-up"
                                                onClick={()=>handleAddUnits()}>+</span>
                                                <span className="qty-down" onClick={()=>handleSubUnits()}>-</span>
                                            </div>
                                        </div>
                                        <button disabled = {!allowAddToCart} onClick={() => handleAddToCart()}  className="add-to-cart-btn"><i className="fa fa-shopping-cart" /> thêm vào giỏ</button>
                                    </div>
                                    
                                </div>
                            </div>
                            {/* /Product details */}
                            {/* Product tab */}
                            <div className="col-md-12">
                                <div id="product-tab">
                                    {/* product tab nav */}
                                    <ul className="tab-nav">
                                        <li className="active"><a data-toggle="tab" href="#tab1">Thông tin</a></li>
                                        {/* <li><a data-toggle="tab" href="#tab3">Đánh giá (3)</a></li> */}
                                    </ul>
                                    {/* /product tab nav */}
                                    {/* product tab content */}
                                    <div className="tab-content">
                                        {/* tab1  */}
                                        <div id="tab1" className="tab-pane fade in active">
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <p>{product.description}</p>
                                                </div>
                                            </div>
                                        </div>
                                        {/* /tab1  */}
                                        {/* tab2  */}
                                        {/* /tab2  */}
                                        {/* tab3  */}
                                        <div id="tab3" className="tab-pane fade in">
                                            <div className="row">
                                                {/* Rating */}
                                                <div className="col-md-3">
                                                    <div id="rating">
                                                        <div className="rating-avg">
                                                            <span>4.5</span>
                                                            <div className="rating-stars">
                                                                <i className="fa fa-star" />
                                                                <i className="fa fa-star" />
                                                                <i className="fa fa-star" />
                                                                <i className="fa fa-star" />
                                                                <i className="fa fa-star-o" />
                                                            </div>
                                                        </div>
                                                        <ul className="rating">
                                                            <li>
                                                                <div className="rating-stars">
                                                                    <i className="fa fa-star" />
                                                                    <i className="fa fa-star" />
                                                                    <i className="fa fa-star" />
                                                                    <i className="fa fa-star" />
                                                                    <i className="fa fa-star" />
                                                                </div>
                                                                <div className="rating-progress">
                                                                    <div style={{ width: '80%' }} />
                                                                </div>
                                                                <span className="sum">3</span>
                                                            </li>
                                                            <li>
                                                                <div className="rating-stars">
                                                                    <i className="fa fa-star" />
                                                                    <i className="fa fa-star" />
                                                                    <i className="fa fa-star" />
                                                                    <i className="fa fa-star" />
                                                                    <i className="fa fa-star-o" />
                                                                </div>
                                                                <div className="rating-progress">
                                                                    <div style={{ width: '60%' }} />
                                                                </div>
                                                                <span className="sum">2</span>
                                                            </li>
                                                            <li>
                                                                <div className="rating-stars">
                                                                    <i className="fa fa-star" />
                                                                    <i className="fa fa-star" />
                                                                    <i className="fa fa-star" />
                                                                    <i className="fa fa-star-o" />
                                                                    <i className="fa fa-star-o" />
                                                                </div>
                                                                <div className="rating-progress">
                                                                    <div />
                                                                </div>
                                                                <span className="sum">0</span>
                                                            </li>
                                                            <li>
                                                                <div className="rating-stars">
                                                                    <i className="fa fa-star" />
                                                                    <i className="fa fa-star" />
                                                                    <i className="fa fa-star-o" />
                                                                    <i className="fa fa-star-o" />
                                                                    <i className="fa fa-star-o" />
                                                                </div>
                                                                <div className="rating-progress">
                                                                    <div />
                                                                </div>
                                                                <span className="sum">0</span>
                                                            </li>
                                                            <li>
                                                                <div className="rating-stars">
                                                                    <i className="fa fa-star" />
                                                                    <i className="fa fa-star-o" />
                                                                    <i className="fa fa-star-o" />
                                                                    <i className="fa fa-star-o" />
                                                                    <i className="fa fa-star-o" />
                                                                </div>
                                                                <div className="rating-progress">
                                                                    <div />
                                                                </div>
                                                                <span className="sum">0</span>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                                {/* /Rating */}
                                                {/* Reviews */}
                                                <div className="col-md-6">
                                                    <div id="reviews">
                                                        <ul className="reviews">
                                                            <li>
                                                                <div className="review-heading">
                                                                    <h5 className="name">John</h5>
                                                                    <p className="date">27 DEC 2018, 8:0 PM</p>
                                                                    <div className="review-rating">
                                                                        <i className="fa fa-star" />
                                                                        <i className="fa fa-star" />
                                                                        <i className="fa fa-star" />
                                                                        <i className="fa fa-star" />
                                                                        <i className="fa fa-star-o empty" />
                                                                    </div>
                                                                </div>
                                                                <div className="review-body">
                                                                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua</p>
                                                                </div>
                                                            </li>
                                                            <li>
                                                                <div className="review-heading">
                                                                    <h5 className="name">John</h5>
                                                                    <p className="date">27 DEC 2018, 8:0 PM</p>
                                                                    <div className="review-rating">
                                                                        <i className="fa fa-star" />
                                                                        <i className="fa fa-star" />
                                                                        <i className="fa fa-star" />
                                                                        <i className="fa fa-star" />
                                                                        <i className="fa fa-star-o empty" />
                                                                    </div>
                                                                </div>
                                                                <div className="review-body">
                                                                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua</p>
                                                                </div>
                                                            </li>
                                                            <li>
                                                                <div className="review-heading">
                                                                    <h5 className="name">John</h5>
                                                                    <p className="date">27 DEC 2018, 8:0 PM</p>
                                                                    <div className="review-rating">
                                                                        <i className="fa fa-star" />
                                                                        <i className="fa fa-star" />
                                                                        <i className="fa fa-star" />
                                                                        <i className="fa fa-star" />
                                                                        <i className="fa fa-star-o empty" />
                                                                    </div>
                                                                </div>
                                                                <div className="review-body">
                                                                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua</p>
                                                                </div>
                                                            </li>
                                                        </ul>
                                                        <ul className="reviews-pagination">
                                                            <li className="active">1</li>
                                                            <li><a href="#">2</a></li>
                                                            <li><a href="#">3</a></li>
                                                            <li><a href="#">4</a></li>
                                                            <li><a href="#"><i className="fa fa-angle-right" /></a></li>
                                                        </ul>
                                                    </div>
                                                </div>
                                                {/* /Reviews */}
                                                {/* Review Form */}
                                                <div className="col-md-3">
                                                    <div id="review-form">
                                                        <form className="review-form">
                                                            <input className="input" type="text" placeholder="Your Name" />
                                                            <input className="input" type="email" placeholder="Your Email" />
                                                            <textarea className="input" placeholder="Your Review" defaultValue={""} />
                                                            <div className="input-rating">
                                                                <span>Your Rating: </span>
                                                                <div className="stars">
                                                                    <input id="star5" name="rating" defaultValue={5} type="radio" /><label htmlFor="star5" />
                                                                    <input id="star4" name="rating" defaultValue={4} type="radio" /><label htmlFor="star4" />
                                                                    <input id="star3" name="rating" defaultValue={3} type="radio" /><label htmlFor="star3" />
                                                                    <input id="star2" name="rating" defaultValue={2} type="radio" /><label htmlFor="star2" />
                                                                    <input id="star1" name="rating" defaultValue={1} type="radio" /><label htmlFor="star1" />
                                                                </div>
                                                            </div>
                                                            <button className="primary-btn">Submit</button>
                                                        </form>
                                                    </div>
                                                </div>
                                                {/* /Review Form */}
                                            </div>
                                        </div>
                                        {/* /tab3  */}
                                    </div>
                                    {/* /product tab content  */}
                                </div>
                            </div>
                            {/* /product tab */}
                        </div>
                        {/* /row */}
                    </div>
                    {/* /container */}
                </div>
                {/* /SECTION */}
                {/* Section */}
                {product && product.categories && 
                <CategoryProduct title={"Sản phẩm liên quan"} categories={product?.categories} isNewDiscovery = {true}></CategoryProduct>}
        
                {/* /Section */}
            </div> : <div></div>)
}
export default Product;