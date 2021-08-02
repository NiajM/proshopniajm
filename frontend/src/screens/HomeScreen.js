import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import Paginate from '../components/Paginate'
import ProductCarousel from '../components/ProductCarousel'
import Meta from '../components/Meta'
import { listProducts } from '../actions/productActions'
import GroupByDate from '../components/GroupByDate'
import CarouselCaptionBottom1 from '../components/CarouselCaptionBottom1/CarouselCaptionBottom1'

const HomeScreen = ({ match }) => {

    const keyword = match.params.keyword
    const pageNumber = match.params.pageNumber || 1

    const dispatch = useDispatch()

    const productList = useSelector(state => state.productList)
    const { loading, error, products, page, pages } = productList

    useEffect(() => {
        dispatch(listProducts(keyword, pageNumber))
    }, [dispatch, keyword, pageNumber])

    return (
        <>

            <Meta />
            {!keyword ? (
                <div className='m-0'>
                    <CarouselCaptionBottom1 />
                </div>
            ) : (<Link to='/' className='btn btn-light'>Go Back</Link>)}

            {loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> : products && (
                <>
                    {/* Rules To Use GroupByDate------------------
                products must be an one-dimensinal Json-Array
                Checking Date field name must be updatedAt */}
                    <GroupByDate products={products} headingName='Latest Products...' />
                    <Paginate pages={pages} page={page} keyword={keyword ? keyword : ''} />
                </>
            )}
        </>
    )
}

export default HomeScreen