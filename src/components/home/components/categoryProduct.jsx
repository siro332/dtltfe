import { React, useState, useEffect } from "react"
import axios from 'axios';
import { PATH } from "../../../constants/API";
import { NavLink, redirect, useNavigate } from "react-router-dom";
import Slider from "react-slick/lib/slider";
function CategoryProduct({title, categories,isNewDiscovery }) {
    const navigate = useNavigate()
    const settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 4,
        initialSlide: 0,
        responsive: [
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 3,
              infinite: true,
              dots: true
            }
          },
          {
            breakpoint: 600,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 2,
              initialSlide: 2
            }
          },
          {
            breakpoint: 480,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1
            }
          }
        ]
      };
    const [tabActive,setTabActive] = useState(false);
    const [discoveryNewProductLoading, setDiscoveryNewProductLoading] = useState(true);
    const [discoveryNewProduct, setDiscoveryNewProduct] = useState(new Map());
    const [discoveryTopSellProductLoading, setDiscoveryTopSellProductLoading] = useState(true);
    const [discoveryTopSellProduct, setDiscoveryTopSellProduct] = useState([]);
    const handleTabActive = (active) => {
        setTabActive(active)
    } 
    useEffect(
        () => {
            async function fetchData() {
                setDiscoveryNewProductLoading(true);
                try {
                    categories.map(async (item) => {
                        const response = await axios.get( 
                            isNewDiscovery?
                            (PATH.API_ROOT_URL + PATH.API_CATALOG +"/products/search"):(PATH.API_ROOT_URL + PATH.API_CATALOG +"/products/category/" +item.code+"/topSales"), 
                        {
                            params: {
                                page: 0,
                                size: 8,
                                sortParam: "created_at",
                                sortDirection: "DESC",
                                categoryCode: item.code
                            }
                        }          
                    );
                    setDiscoveryNewProduct(map => new Map(map.set(item.code, response.data.products)))
                    }) 
                } catch (error) {
                    console.error(error.message);
                }
                setDiscoveryNewProductLoading(false);
            }
            fetchData();
        }, [categories, isNewDiscovery, title])
    return (
        categories && <div className="section">
        {/* container */}
        <div className="container">
          {/* row */}
          <div className="row">
            {/* section title */}
            <div className="col-md-12">
              <div className="section-title">
                <h3 className="title">{title}</h3>
                <div className="section-nav">
                  <ul className="section-tab-nav tab-nav">
                    {categories?.map((item,index) =>(
                        index===0? (<li className="active"><a data-toggle="tab" href={isNewDiscovery? ("#new"+ item.code):("#top" + item.code)}>{item.name}</a></li>):
                        (<li><a data-toggle="tab" href={isNewDiscovery? ("#new"+ item.code):("#top" + item.code)}>{item.name}</a></li>)
                    ))}
                       
                  </ul>
                </div>
              </div>
            </div>
            {/* /section title */}
            {/* Products tab & slick */}
            <div className="col-md-12">
              <div className="row">
                <div className="products-tabs">
                  {categories?.map((item,index)=>(
                      <div id={isNewDiscovery? ("new"+ item.code):("top" + item.code)} className={index ===0? "tab-pane active":"tab-pane"}>
                      <div className="products-slick" data-nav="#slick-nav-1">   
                      <Slider {...settings}>
                      {
                        discoveryNewProduct.get(item.code) &&
                        discoveryNewProduct.get(item.code).length >0? 
                         discoveryNewProduct.get(item.code).map((product) =>(
                            
                            <div className="product">
                            <div className="product-img">
                            <img src={product.mediaList.length >0? product.mediaList.length >0? product.mediaList[0].imgUrl : "" : ""} alt="Product" />
                            </div>
                            <div className="product-body">
                              <p className="product-category"><NavLink to={"/category/" + item.code}>
                                            {item.name}
                                        </NavLink></p>
                              <h3 className="product-name"><NavLink to={"/product/" + product.code}>
                                            {product.name}
                                        </NavLink></h3>
                              <h4 className="product-price">{product.price + " VND"}</h4>
                              {/* <div className="product-rating">
                                <i className="fa fa-star" />
                                <i className="fa fa-star" />
                                <i className="fa fa-star" />
                                <i className="fa fa-star" />
                                <i className="fa fa-star" />
                              </div> */}
                              
                            </div>
                            <div className="add-to-cart">
                            {/* <NavLink className="add-to-cart-btn" to={"/product/" + item.code}>
                            <i className="fa fa-shopping-cart" />
                                    Thêm vào giỏ
                                        </NavLink> */}
                              <button className="add-to-cart-btn" onClick={() => navigate("/product/"+product.code)}><i className="fa fa-shopping-cart" /> Thêm vào giỏ</button>
                            </div>
                          </div>
                        )):<div></div>}
                          </Slider>                  
                        
                      </div>
                      <div id="slick-nav-1" className="products-slick-nav" />
                    </div>
                  ))}
                  {/* /tab */}
                </div>
              </div>
            </div>
            {/* Products tab & slick */}
          </div>
          {/* /row */}
        </div>
        {/* /container */}
      </div>
    )
}
export default CategoryProduct