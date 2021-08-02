import React, { useState } from 'react'
import { Form, Button, Row, Col } from 'react-bootstrap'

// Since the search box will be embeded in the header, er are not going to have direct access to props.history- We are going to have to use something called a render prop

const SearchBox = ({ history }) => {

    const [keyword, setKeyword] = useState('')

    const submitHandler = (e) => {
        e.preventDefault()
        if (keyword.trim()) {
            history.push(`/search/${keyword}`)
        } else {
            history.push('/')
        }
    }

    return (
        <Form onSubmit={submitHandler} inline>
            <Row>
                <Col>
                    <Form.Control
                    type='text'
                    name='q'
                    placeholder='Search Products...'
                    className='ms-sm-2 me-sm-5'
                    onChange={(e) => setKeyword(e.target.value)}>
                    </Form.Control>
                </Col>
                <Col>
                    <Button type='submit' variant='outline-success' className='p-2 ms-0'>
                        Search
                    </Button>
                </Col>
            </Row>
        </Form>
    )
}

export default SearchBox
