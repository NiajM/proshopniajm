import React, { useEffect } from 'react'
import { Carousel, Image, Row, Col, Card } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import Loader from '../Loader'
import Message from '../Message'
import { listTopProducts } from '../../actions/productActions'
import './CarouselCaptionBottom1.css'

const CarouselCaptionBottom1 = () => {

  const dispatch = useDispatch()

  const productTopRated = useSelector(state => state.productTopRated)
  const { loading, error, products } = productTopRated

  useEffect(() => {

    dispatch(listTopProducts())

  }, [dispatch])

  return loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> : (

    <Carousel
      // fade
      controls={false}
      pause='hover'
      className='bg-transparent carousel-caption-bottom-1'
    // activeIndex={index}
    // onSelect={handleSelect}
    // variant='dark'
    // indicatorLabels
    // indicators={false}
    // interval={55555555}
    // nextIcon
    // prevIcon
    // wrap
    // touch
    >
      {products.map(product => (
        <Carousel.Item key={product._id}>
          <Link to={`/product/${product._id}`} className='link-ccb-1'>
            <Row>
              <Col className='col-lg-5 col-md-5 col-sm-12'>
                <Carousel.Caption className=''>
                  <legend className=''>{product.name}{' '}
                    <small>{' '}(${product.price})</small>
                  </legend>
                  {/* <h6>Price: ${product.price}</h6> */}

                  <Card.Text className='pt-5'>Try the Top Rated Product...</Card.Text>
                </Carousel.Caption>
              </Col>
              <Col className='col-lg-7 col-md-7 col-sm-12'>
                <Image
                  className='d-block w-100'
                  src={product.image}
                  alt={product.name}
                />
              </Col>
            </Row>
          </Link>
        </Carousel.Item>

      ))}
    </Carousel>

  )
}
export default CarouselCaptionBottom1
