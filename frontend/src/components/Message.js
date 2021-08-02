import React from 'react'
import { Alert } from 'react-bootstrap'

const Message = ({ variant, children }) => {   // Passing two Props-> variant and children
    return (
        <Alert variant={variant}>
            {children}
        </Alert>
    )
}

Message.defaultProps = {    // Setting default for variant
    variant: 'info' // 'info' is just a blue color
}

export default Message
