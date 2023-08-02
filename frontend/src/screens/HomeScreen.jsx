import React, { useEffect } from 'react'
import {Helmet} from 'react-helmet'
import { useDispatch, useSelector } from 'react-redux'
import Product from '../components/Product';
import Message from '../components/Message';
import Loader from '../components/Loader'
import { Row, Col } from 'react-bootstrap';
import { listProducts } from '../actions/productActions'
import { Link, useParams } from 'react-router-dom';
import Paginate from '../components/Paginate';
import ProductCarousel from '../components/ProductCarousel';
import Meta from '../components/Meta';
import CategoriesBar from '../components/CategoriesBar';

const HomeScreen = () => {
  const dispatch = useDispatch()
  const { keyword, pageNumber = 1 } = useParams()
  console.log('keyword: ', keyword, 'pageNumber: ', pageNumber);

  const productList = useSelector(state => state.productList)
  const { loading, products, error, page, pages } = productList
  console.log('productList: ',productList);

  useEffect(() => {
    dispatch(listProducts(keyword, pageNumber))
  }, [dispatch, keyword, pageNumber])



  return (
    <>
      <Meta />
      <CategoriesBar />
      { !keyword ? <ProductCarousel /> : <Link to='/' className='btn btn-light'>Home</Link> }
      <h1>Latest Products</h1>
      {loading ? (
        <Loader />
        ) : error ? (
          <Message variant='danger'>{error}</Message>
        ) : (
          <>
            <Row>
              {products.map( product => (
                  <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                      <Product product={product} />
                  </Col>
              ))}
            </Row>
            <Paginate 
              pages={pages}
              pageNumber={page}
              keyword={keyword ? keyword : ''}
            />
          </>
        )
      }
      
    </>
  )
}

export default HomeScreen