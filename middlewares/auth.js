import jwt from 'jsonwebtoken'

const auth = async(req,res,next) => {
    try {
        const token = req.headers.authorization.split(" ")[1] // authorization must be lower (in the front-end it doesn't matter)
        const isCustomAuth = token.length < 500

        let decodedData

        // we may 2 different types of tokens: custom or google
        if (token && isCustomAuth) {
            decodedData = jwt.verify(token, process.env.SECRET)
            req.userId = decodedData?.id
        } else {
            decodedData = jwt.decode(token)
            req.userId = decodedData?.sub // is a specific for google's id
        }

        next()
    } catch(error) {
        console.log(error)
    }
}

export default auth