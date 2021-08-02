import jwt from 'jsonwebtoken'

const generateToken = (id) => { // This id will be add as the payload in this token
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'    // Tken expiration for 30 days
    })
}

export default generateToken