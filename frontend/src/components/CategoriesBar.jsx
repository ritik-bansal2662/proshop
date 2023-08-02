// refer to the source code
// https://www.codingnepalweb.com/draggable-slider-tabs-html-css-javascript/

import React from 'react'
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";



const CategoriesBar = () => {
    const categories = [
        'books',
        'electornics',
        'mobiles',
        'camera',
        'Iphone',
        'headset',
        'gaming',
        'ps5',
        'samsung',
        'apple',
        'redmi',
        'realme',
        'tv',
        'led',
        'best books',
        'earbuds',
        'wireless',
        'headphone',
        'airpods',
        'boat',
        'mivi'
    ]

    const responsive = {
        desktop: {
          breakpoint: { max: 3000, min: 1024 },
          items: 10,
          paritialVisibilityGutter: 60
        },
        tablet: {
          breakpoint: { max: 1024, min: 464 },
          items: 7,
          paritialVisibilityGutter: 50
        },
        mobile: {
          breakpoint: { max: 464, min: 0 },
          items: 5,
          paritialVisibilityGutter: 30
        }
      };
    // ssr
  return (
    <div className='container gd-carousel-wrapper'>
        <Carousel
        ssr
        partialVisibile={false}
        responsive={responsive}
        containerClass="carousel-container"
        swipeable={true}
        draggable={true}
        scrollable={true}
        slidesToSlide={5}
        className="gd-carousel"
        >
        {categories.map((category, index) => {
            return (
            <div key={index+1} className='btn btn-outline-dark m-1 p-2 rounded-pill'>{category}</div>
            );
        })}
        </Carousel>
    </div>
  )
}

export default CategoriesBar