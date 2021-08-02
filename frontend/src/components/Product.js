import React from 'react'
import { Link } from 'react-router-dom'
import { Card } from 'react-bootstrap'
import Rating from './Rating'

const Product = ({ product }) => {
    return (
        <Card className='my-3 p-3 rounded'>
            <Link to={`/product/${product._id}`}>
                <Card.Img
                    src={product.image}
                    variant='top'
                    height={220}
                />
            </Link>

            <Card.Body>
                <Link to={`/product/${product._id}`}>
                    <Card.Title as='div' style={{ height: '50px' }}>
                        <strong>{product.name}</strong>
                    </Card.Title>
                </Link>
                <Card.Text as='h6'>${product.price}</Card.Text>
                <Card.Text as='small'>
                    <Rating value={product.rating} text={`${product.numReviews} reviews`} />
                </Card.Text>
                {/* <Card.Text as='h6'>{new Date(product.updatedAt).toDateString()}</Card.Text> */}
            </Card.Body>
        </Card>
    )
}

export default Product