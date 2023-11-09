const { expressjwt } = require('express-jwt');
const verifyUser = require('./verifyUser')
const secret = process.env.SECRET

const isRevoked = (req, token) => {
    console.log(token.payload.id)
    if (verifyUser(token.payload.id)) {
        req.userId = token.payload.id
        if (token.payload.isAdmin) {
            return false;
        } else {
            if (
                (req.method === 'GET' && req.originalUrl.includes('/api/v1/posts')) ||
                (req.method === 'POST' && req.originalUrl === '/api/v1/posts') ||
                (req.method === 'PATCH' && req.originalUrl.includes('/api/v1/posts')) ||
                (req.method === 'DELETE' && req.originalUrl.includes('/api/v1/posts'))
            ) {
                return false;
            }
        }
        // Deny access to all other routes
        return true;
    }
}



const authJwt = expressjwt({
    secret,
    algorithms: ['HS256'],
    isRevoked: isRevoked
}).unless(
    {
        path: [
            { url: "/api/v1/auth/register", method: ["POST", 'OPTIONS'] },
            { url: "/api/v1/auth/login", method: ["POST", 'OPTIONS'] },
        ]
    }
)


module.exports = authJwt