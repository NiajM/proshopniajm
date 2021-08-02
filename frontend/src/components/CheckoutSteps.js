import React from 'react'
import { Nav } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
    return (
        <Nav className='justify-content-center mb-4' style={{ backgroundColor: '#000' }}>
            <Nav.Item>
                {
                    step1 ? (   // If step1 is there
                        <LinkContainer to='/login'>
                            <Nav.Link>Sign In</Nav.Link>
                        </LinkContainer>
                    ) : (   // If step1 is not passed in
                        <Nav.Link disabled>Sign In</Nav.Link>
                    )
                }
            </Nav.Item>
            <Nav.Item>
                {
                    step2 ? (   // If step2 is there
                        <LinkContainer to='/shipping'>
                            <Nav.Link>Shipping</Nav.Link>
                        </LinkContainer>
                    ) : (   // If step2 is not passed in
                        <Nav.Link disabled>Shipping</Nav.Link>
                    )
                }
            </Nav.Item>
            <Nav.Item>
                {
                    step3 ? (   // If step3 is there
                        <LinkContainer to='/payment'>
                            <Nav.Link>Payment</Nav.Link>
                        </LinkContainer>
                    ) : (   // If step3 is not passed in
                        <Nav.Link disabled>Payment</Nav.Link>
                    )
                }
            </Nav.Item>
            <Nav.Item>
                {
                    step4 ? (   // If step4 is there
                        <LinkContainer to='/placeorder'>
                            <Nav.Link>Place Order</Nav.Link>
                        </LinkContainer>
                    ) : (   // If step4 is not passed in
                        <Nav.Link disabled>Place Order</Nav.Link>
                    )
                }
            </Nav.Item>
        </Nav>
    )
}

export default CheckoutSteps
