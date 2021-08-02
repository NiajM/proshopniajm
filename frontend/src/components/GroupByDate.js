import React, { useState } from 'react'
import { Row, Col, Button, Card, ListGroup } from 'react-bootstrap'
import Product from './Product'

const GroupByDate = ({ products = [], headingName = '' }) => {

    const [groupBy, setGroupBy] = useState('')  // group purpose
    let comparer = ''  // group purpose

    // currentdate === Date() and return String
    const getGroupAsDay = (currentDate) => {
        return currentDate.toDateString()
    }
    // currentdate === Date() and return String
    const getGroupAsWeek = (currentDate) => {
        const oneJan = new Date(currentDate.getFullYear(), 0, 1)
        const numberOfDays = Math.floor((currentDate - oneJan) / (24 * 60 * 60 * 1000))
        const result = Math.ceil((currentDate.getDay() + 1 + numberOfDays) / 7)
        return `Week ${result} of ${currentDate.getFullYear()}`
    }
    // currentdate === Date() and return String
    const getGroupAsMonth = (currentDate) => {
        return (currentDate.toDateString().substr(4, 3) + currentDate.toDateString().substr(10, 5))
    }
    // currentdate === Date() and return String
    const getGroupAsYear = (currentDate) => {
        return currentDate.getFullYear().toString()
    }

    // _groupBy === String(), _currentDate === Date() and return String
    const selectGroupType = (_groupBy, _currentDate) => {

        if (_groupBy === 'day') {
            return getGroupAsDay(_currentDate)
        } else if (_groupBy === 'week') {
            return getGroupAsWeek(_currentDate)
        } else if (_groupBy === 'month') {
            return getGroupAsMonth(_currentDate)
        } else if (_groupBy === 'year') {
            return getGroupAsYear(_currentDate)
        } else return 'No Group with this Type'
    }

    return (
        <>
            <Row className='mt-5'>
                <Col md={6}>
                    <Card>
                        <ListGroup>
                            <ListGroup.Item><h4>{headingName}</h4></ListGroup.Item>
                        </ListGroup>
                    </Card>
                </Col>
                <Col md={1}></Col>
                <Col md={5}>
                    <Card>
                        <ListGroup variant='flush'>
                            <ListGroup.Item><h5>Browse as Group</h5></ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col md={2}>
                                        <Button className='btn-md' disabled={groupBy === ''} onClick={() => setGroupBy('')}>Default</Button>
                                    </Col>
                                    <Col md={1}>
                                    </Col>
                                    <Col md={9}>
                                        <Button className='btn-md' disabled={groupBy === 'day'} onClick={() => setGroupBy('day')}>Day</Button>
                                        <Button className='btn-md' disabled={groupBy === 'week'} onClick={() => setGroupBy('week')}>Week</Button>
                                        <Button className='btn-md' disabled={groupBy === 'month'} onClick={() => setGroupBy('month')}>Month</Button>
                                        <Button className='btn-md' disabled={groupBy === 'year'} onClick={() => setGroupBy('year')}>Year</Button>
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
            {/* ------------Show Products as Group----------------------- */}
            <Row>
                {products.map(product => (
                    <>
                        {groupBy !== '' && (
                            (comparer !== selectGroupType(groupBy, new Date(product.updatedAt))) && (
                                <Card>
                                    <Row style={{ backgroundColor: 'black' }}>
                                        <Col md={6}>
                                            <ListGroup>
                                                <ListGroup.Item>
                                                    <h5>{comparer = selectGroupType(groupBy, new Date(product.updatedAt))}</h5>
                                                </ListGroup.Item>
                                            </ListGroup>
                                        </Col>
                                    </Row>
                                </Card>
                            )
                        )}
                        <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                            <Product product={product} />
                        </Col>
                    </>
                ))}
            </Row>
        </>
    )
}

export default GroupByDate

