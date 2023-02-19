import { React, useState, useEffect } from "react"
import { NavLink } from "react-router-dom";
import axios from 'axios';
import HomeBanner from "./components/banner";
import LoginForm from "../common/login-form";
import { PATH } from "../../constants/API"
import Header from "../common/header";
import CategoryProduct from "./components/categoryProduct";
function Home({categories}) {
    const [sliderLoading, setSliderLoading] = useState(true);
    const [sliderArray, setSliderArray] = useState([]);

    const [discoveryCategories, setDiscoveryCategories] = useState([]);
    const [discoveryCategoriesLoading, setDiscoveryCategoriesLoading] = useState(true);

    useEffect(
        () => {
            async function fetchData() {
                setSliderLoading(true);
                try {
                    const response = await axios.get(PATH.API_ROOT_URL + PATH.API_MEDIA + "/type/Slider");
                    setSliderArray(response.data.mediaList);
                } catch (error) {
                    console.error(error.message);
                }
                setSliderLoading(false);
            }
            fetchData();
        }, []);
    useEffect(
        () => {
            async function fetchData() {
                // You can await here
                setDiscoveryCategoriesLoading(true);
                try {
                    const response = await axios.get(PATH.API_ROOT_URL + PATH.API_CATALOG + "/categories/discovery", { params: { number: 6 } });
                    setDiscoveryCategories(response.data);
                } catch (error) {
                    console.error(error.message);
                }
                setDiscoveryCategoriesLoading(false);
            }
            fetchData();
        }, []);
    function shuffle(array) {
        const newArray = JSON.parse(JSON.stringify(array));
        let currentIndex = newArray.length,  randomIndex;
        
        // While there remain elements to shuffle.
        while (currentIndex !== 0) {
        
            // Pick a remaining element.
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
        
            // And swap it with the current element.
            [newArray[currentIndex], newArray[randomIndex]] = [
            newArray[randomIndex], newArray[currentIndex]];
        }
        
        return newArray;
        }
    return (
        <div>
        {/* SECTION */}
        <div className="section">
          {/* container */}
          <div className="container">
            {/* row */}
            <div className="row">
              {shuffle(categories).slice(0, 3).map((item) =>(
              <div className="col-md-4 col-xs-6">
                <div className="shop">
                    <div className="shop-img">
                        <img src={item.imgUrl} alt="" />
                    </div>
                    <div className="shop-body">
                    <h3>{item.name}</h3>
                    <NavLink to={"/category/"+item.code} className="cta-btn">
                    Mua ngay <i className="fa fa-arrow-circle-right" />
                    </NavLink>
                    </div>
                </div>
              </div>
              ))}
              
              {/* /shop */}
            </div>
            {/* /row */}
          </div>
          {/* /container */}
        </div>
        {/* /SECTION */}
        {/* SECTION */}
        <CategoryProduct title={"Sản phẩm mới"} categories={categories} isNewDiscovery = {true}></CategoryProduct>
        {/* /SECTION */}
        {/* SECTION */}
        <CategoryProduct title={"Bán chạy"} categories={categories} isNewDiscovery = {false}></CategoryProduct>
        {/* /SECTION */}

      </div>
    );
}
export default Home;