import jwt from 'jsonwebtoken'


// middleware to verify jwt tokens
const verifyJwt = (req, res, next) => {

    const header = req.headers.Authorization || req.headers.authorization

    if (!header?.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthoirzed User (token verification failed)' })
    }

    const token = header.split(' ')[1]

    jwt.verify(token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: 'Unauthoirzed User (token verification failed)' })
            }
            req.user = decoded;
            next()
        }
    )
}


export { verifyJwt }