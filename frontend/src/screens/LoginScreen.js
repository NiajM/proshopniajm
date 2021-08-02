import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import {  useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'
import { login } from '../actions/userActions'

const LoginScreen = ({ location, history }) => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const dispatch = useDispatch()

    const userLogin = useSelector(state => state.userLogin)	// This state.userLogin->userLogin is from store.js (const reducer) (userLogin: userLoginReducer)
    const { loading, error, userInfo } = userLogin

    const redirect = location.search ? location.search.split('=')[1] : '/' // location.search have the URL query string 

    useEffect(() => {   // Don't come at Login Screen if already logged in
	
        if (userInfo) {
            history.push(redirect)
        }
    }, [history, userInfo, redirect])   // [] passing the dependencies

    const submitHandler = (e) => {
        e.preventDefault()  // So the page doesn't actually refresh and The preventDefault() method stops the default action of a selected element from happening by a user. This method does not accept any parameter and works in two ways: --- It prevents a link from following the URL so that the browser can't go another page....It prevents a submit button from submitting a form.
        dispatch(login(email, password))
    }

    return (
        <FormContainer>
            <h1>Sign In</h1>
            {error && <Message variant='danger'>{error}</Message>}
            {loading && <Loader />}
            <Form onSubmit={submitHandler}>
                {/* Email Field */}
                <Form.Group controlId='email'>
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control type='email' placeholder='Enter email' value={email} onChange={(e) => setEmail(e.target.value)}></Form.Control>
                </Form.Group>
                {/* Password Field */}
                <Form.Group controlId='password'>
                    <Form.Label>Password</Form.Label>
                    <Form.Control type='password' placeholder='Enter password' value={password} onChange={(e) => setPassword(e.target.value)}></Form.Control>
                </Form.Group>
                {/* Button to send the Request */}
                <Button type='submit' variant='primary'>
                    Sign In
                </Button>
            </Form>
            {/* Register page link for new user */}
            <Row className='py-3'>
                <Col>
                    New Customer?{' '}
                    <Link to={redirect ? `/register?redirect=${redirect}` : '/register'}>
                        Register
                    </Link>
                </Col>
            </Row>
        </FormContainer>
    )
}

export default LoginScreen
