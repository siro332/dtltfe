/* eslint-disable jsx-a11y/anchor-is-valid */
import { React, useState, useEffect, useContext } from "react"
import axios from 'axios';
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { PATH } from "../../constants/API"
import Header from "../common/header";
import CategoryProduct from "../home/components/categoryProduct";
import { SearchContext } from "../helpers/context/search-context";
function Search({ categories }) {
    const navigate = useNavigate()
    const searchContext = useContext(SearchContext);
    const [page, setPage] = useState(1);
    const [pageNumbers, setPageNumbers] = useState([]);
    const [sortBy, setSortBy] = useState("created_at");
    const [order, setOrder] = useState("DESC");
    const [priceRange, setPriceRange] = useState([0, 9999999999]);
    const [categoryList, setCategory] = useState(undefined);
    const [categoryLoading, setCategoryLoading] = useState(true);
    const [productPage, setProductPage] = useState(undefined);
    const [productPageLoading, setProductPageLoading] = useState(true);
    const [pageSize, setPageSize] = useState(3);

    const handleSortByChange = (e) => {
        const field = e.target.value.split(" ")
        setSortBy(field[0]);
        setOrder(field[1]);
    }
    const handlePriceRangeChange = (e) => {
        const field = e.target.id.split("-")
        setPriceRange(field);
    }
    const handleNextChange = () => {
        setPage(page + 1)
    }
    const handlePrevChange = () => {
        setPage(page - 1)
    }
    const handleClickPage = (item) => {
        setPage(item)
    }
    const handlePageSizeChange = (e) => {
        setPageSize(e.target.value)
    }
    useEffect(
        () => {
            async function fetchData() {
                // You can await here
                setProductPageLoading(true);
                try {
                    const response = await axios.get(PATH.API_ROOT_URL + PATH.API_CATALOG + "/products/search",
                        {
                            params: {
                                page: page - 1,
                                size: pageSize,
                                sortParam: sortBy,
                                sortDirectionStr: order,
                                productName: searchContext.searchParam,
                                lowestPrice: priceRange[0],
                                highestPrice: priceRange[1]
                            }
                        });
                    setProductPage(response.data);
                    const pageNumber = [];
                    const numPages = Math.ceil(response.data.totalPages / 1);
                    for (let i = 1; i <= numPages; i++) {
                        if (i <= 5 || //the first five pages
                            i === numPages || //the last page
                            Math.abs(page - i) <= 1 //the current page and the one before and after
                        )
                            pageNumber.push(i);
                    }
                    setPageNumbers(pageNumber)
                    console.log(response.data)
                } catch (error) {
                    console.error(error);
                }
                setProductPageLoading(false);
            }
            fetchData();
        }, [order, page, sortBy, searchContext, priceRange, pageSize]);
    useEffect(
        () => {
            async function fetchData() {
                // You can await here
                setProductPageLoading(true);
                try {
                    setPage(1)
                } catch (error) {
                    console.error(error.message);
                }
                setProductPageLoading(false);
            }
            fetchData();
        }, [order, sortBy]);

    return (
        productPage != null && 
        <div>
            <div id="breadcrumb" className="section">
                {/* container */}
                <div className="container">
                    {/* row */}
                    <div className="row">
                        <div className="col-md-12">
                            <ul className="breadcrumb-tree">
                                <li><NavLink to="/">
                                    Trang chủ
                                </NavLink></li>
                                <li className="active">Tìm kiếm ({productPage.totalItems})</li>
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
                        {/* ASIDE */}
                        <div id="aside" className="col-md-3">
                            {/* aside Widget */}
                            <div className="aside">
                                <h3 className="aside-title">Danh mục</h3>
                                <div className="checkbox-filter">
                                    <div className="input-checkbox">
                                        {categories?.map((item) => (
                                            <NavLink to={"/category/" + item.code} className="cat-block">
                                                <div htmlFor="category-1">
                                                    {item.name}
                                                </div>
                                            </NavLink>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            {/* /aside Widget */}
                            {/* aside Widget */}
                            <div className="aside">
                                <h3 className="aside-title">Khoảng giá</h3>
                                <div className="widget-body">
                                    <div className="filter-items">
                                        <div className="filter-item">
                                            <div className="custom-control custom-radio">
                                                <input type="radio" className="custom-control-input" id="0-1000000" name="filter-price" onChange={handlePriceRangeChange} />
                                                <label className="custom-control-label" htmlFor="0-1000000">Dưới 1 triệu</label>
                                            </div>{/* End .custom-checkbox */}
                                        </div>{/* End .filter-item */}
                                        <div className="filter-item">
                                            <div className="custom-control custom-radio">
                                                <input type="radio" className="custom-control-input" id="1000000-5000000" name="filter-price" onChange={handlePriceRangeChange} />
                                                <label className="custom-control-label" htmlFor="1000000-5000000">Từ 1 đến 5 triệu</label>
                                            </div>{/* End .custom-checkbox */}
                                        </div>{/* End .filter-item */}
                                        <div className="filter-item">
                                            <div className="custom-control custom-radio">
                                                <input type="radio" className="custom-control-input" id="5000000-10000000" name="filter-price" onChange={handlePriceRangeChange} />
                                                <label className="custom-control-label" htmlFor="5000000-10000000">Từ 5 đến 10 triệu</label>
                                            </div>{/* End .custom-checkbox */}
                                        </div>{/* End .filter-item */}
                                        <div className="filter-item">
                                            <div className="custom-control custom-radio">
                                                <input type="radio" className="custom-control-input" id="10000000-9999999999" name="filter-price" onChange={handlePriceRangeChange} />
                                                <label className="custom-control-label" htmlFor="10000000-9999999999">Trên 10 triệu</label>
                                            </div>{/* End .custom-checkbox */}
                                        </div>{/* End .filter-item */}
                                    </div>{/* End .filter-items */}
                                </div>{/* End .widget-body */}
                            </div>
                            {/* /aside Widget */}
                            {/* aside Widget */}
                            {/* <div className="aside">
                                <h3 className="aside-title">Brand</h3>
                                <div className="checkbox-filter">
                                    <div className="input-checkbox">
                                        <input type="checkbox" id="brand-1" />
                                        <label htmlFor="brand-1">
                                            <span />
                                            SAMSUNG
                                            <small>(578)</small>
                                        </label>
                                    </div>
                                    <div className="input-checkbox">
                                        <input type="checkbox" id="brand-2" />
                                        <label htmlFor="brand-2">
                                            <span />
                                            LG
                                            <small>(125)</small>
                                        </label>
                                    </div>
                                    <div className="input-checkbox">
                                        <input type="checkbox" id="brand-3" />
                                        <label htmlFor="brand-3">
                                            <span />
                                            SONY
                                            <small>(755)</small>
                                        </label>
                                    </div>
                                    <div className="input-checkbox">
                                        <input type="checkbox" id="brand-4" />
                                        <label htmlFor="brand-4">
                                            <span />
                                            SAMSUNG
                                            <small>(578)</small>
                                        </label>
                                    </div>
                                    <div className="input-checkbox">
                                        <input type="checkbox" id="brand-5" />
                                        <label htmlFor="brand-5">
                                            <span />
                                            LG
                                            <small>(125)</small>
                                        </label>
                                    </div>
                                    <div className="input-checkbox">
                                        <input type="checkbox" id="brand-6" />
                                        <label htmlFor="brand-6">
                                            <span />
                                            SONY
                                            <small>(755)</small>
                                        </label>
                                    </div>
                                </div>
                            </div> */}
                            {/* /aside Widget */}
                            {/* aside Widget */}
                            {/* <div className="aside">
                                <h3 className="aside-title">Bán chạy</h3>
                                {discoveryTopSellProduct?.map((item) => (
                                    <div className="product-widget">
                                        <div className="product-img">
                                            <img src={item.imgUrl} alt="" />
                                        </div>
                                        <div className="product-body">
                                            <p className="product-category">{category.name}</p>
                                            <h3 className="product-name"><NavLink to={"/product/" + item.code}>
                                                {item.name}
                                            </NavLink></h3>
                                            <h4 className="product-price">{item.price + " VND"} </h4>
                                        </div>
                                    </div>
                                ))}
                            </div> */}
                            {/* /aside Widget */}
                        </div>
                        {/* /ASIDE */}
                        {/* STORE */}
                        <div id="store" className="col-md-9">
                            {/* store top filter */}
                            <div className="store-filter clearfix">
                                <div className="store-sort">
                                    <label>
                                        Sắp xếp theo:
                                        <select className="input-select" onChange={handleSortByChange}>
                                            <option value={"name ASC"}>Tên A - Z</option>
                                            <option value={"name DESC"}>Tên Z - A</option>
                                            <option value={"price ASC"}>Giá tăng dần</option>
                                            <option value={"price DESC"}>Giá giảm dần</option>
                                        </select>
                                    </label>
                                    <label>
                                        Hiển thị:
                                        <select className="input-select" value={pageSize} onChange={handlePageSizeChange}>
                                            <option value={3}>3</option>
                                            <option value={6}>6</option>
                                        </select>
                                    </label>
                                </div>

                            </div>
                            {/* /store top filter */}
                            {/* store products */}
                            <div className="row">
                                {productPage.products.map((item, index) => (
                                    <div>
                                        {index + 1 % 3 === 0 ? <div className="clearfix visible-lg visible-md visible-sm visible-xs" /> : <div></div>}
                                        <div className="col-md-4 col-xs-6">
                                            <div className="product">
                                                <div className="product-img">
                                                    <img src={item.mediaList.length > 0 ? item.mediaList[0].imgUrl : ""} alt="Product" className="product-image" />
                                                </div>
                                                <div className="product-body">
                                                    <p className="product-category">{item.categories[0].name}</p>
                                                    <h3 className="product-name"><NavLink to={"/product/" + item.code}>
                                                        {item.name}
                                                    </NavLink></h3>
                                                    <h4 className="product-price">{item.price + " VND"} </h4>

                                                </div>
                                                <div className="add-to-cart">
                                                    <button className="add-to-cart-btn" onClick={() => navigate("/product/" + item.code)}><i className="fa fa-shopping-cart" /> Thêm vào giỏ</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {/* /store products */}
                            {/* store bottom filter */}
                            <div className="store-filter clearfix">
                                <span className="store-qty">Hiển thị {productPage.products.length} sản phẩm</span>
                                <ul className="store-pagination">
                                    <li>
                                        {page > 1 && <a onClick={() => handlePrevChange()} >
                                            <i className="fa fa-angle-left" />
                                        </a>}
                                    </li>
                                    {pageNumbers.map((item) => (
                                        <li className={`page-item${item === page ? " active" : ""}`} aria-current="page"><a onClick={() => handleClickPage(item)}>{item}</a></li>
                                    ))}
                                    <li>
                                        <a disabled={page === productPage.totalPages ? true : false} aria-disabled={page === productPage.totalPages ? true : false} onClick={() => handleNextChange()} >
                                            <i className="fa fa-angle-right" />
                                        </a>
                                    </li>
                                </ul>

                            </div>
                            {/* /store bottom filter */}
                        </div>
                        {/* /STORE */}
                    </div>
                    {/* /row */}
                </div>
                {/* /container */}
            </div>
            {/* /SECTION */}
        </div>
    );
}
export default Search;