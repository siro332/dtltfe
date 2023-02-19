import React from "react";


function HomeBanner({ sliderArray }) {
    const options = {
        margin: 0,
        responsiveClass: true,
        nav: true,
        dots: true,
        loop: true,
        autoplay: true,
        smartSpeed: 400,
        responsive: {
            0: {
                items: 1,
                nav: true,

            }
        },
    };
    return (
        <div></div>)
        // sliderArray && sliderArray.length > 0 ?
        //     <OwlCarousel items={sliderArray.length}
        //         className="intro-slider owl-carousel owl-simple owl-nav-inside " {...options}
        //     >
        //         {sliderArray.map((item) => (
        //             <div key={item.code} className="intro-slide" style={{ backgroundImage: "url(" + item.imgUrl + ")" }}>
                        
        //             </div>
        //         ))}
        //     </OwlCarousel> :
        //     <span></span>);
}
export default HomeBanner;