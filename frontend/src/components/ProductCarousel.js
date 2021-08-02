import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Carousel, Image, Row, Col } from 'react-bootstrap'
import Loader from './Loader'
import Message from './Message'
import { listTopProducts } from '../actions/productActions'

const ProductCarousel = () => {

    const dispatch = useDispatch()

    const productTopRated = useSelector(state => state.productTopRated)
    const { loading, error, products } = productTopRated

    useEffect(() => {

        dispatch(listTopProducts())

    }, [dispatch])


    return loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> : (
        <Carousel pause='hover' className='bg-light-blue' >
            {products.map(product => (
                <Carousel.Item key={product._id}>
                    <Link style={{ width: '100%', marginRight: '0', color: '#f9f9f9' }} to={`/product/${product._id}`}>
                        <Row style={{ height: '60px' }}>
                            <Col style={{ paddingLeft: '400px', paddingTop: '10px' }}><p>Try the Top Rated Product</p></Col>
                        </Row>
                        <Row style={{ border: '3px solid #3388d8', margin: '0' }}>
                            <Col style={{ paddingTop: '20px', paddingLeft: '80px' }} md={4}>
                                <h1>
                                    {product.name}
                                </h1>
                                <h2>
                                    Price: ${product.price}
                                </h2>
                            </Col>
                            <Col md={8}>
                                <Image src={product.image} alt={product.name} fluid />
                            </Col>
                        </Row>
                    </Link>
                </Carousel.Item>
            ))}
        </Carousel>
    )
}

export default ProductCarousel
