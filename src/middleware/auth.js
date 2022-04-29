let jwt = require('jsonwebtoken')

//creating authorization using middleware function
const authorize = function (req, res, next) {
    // using try catch block function
    try {
        let token = req.headers["x-Api-Key"];
        //check lowercase
        if (!token) token = req.headers["x-api-key"]

        //return a error if token is not present
        if (!token) {
            return res.status(404).send({ status: false, msg: "Token must be present" })
        }
        // if token is present then verify the token and assing to decode variable
        let decode = jwt.verify(token, "group40-phase2");
        console.log(decode)
        //return a error if decode token is invalid
        if (!decode) {
            return res.status(403).send({ status: false, msg: "Invalid Token" })
        }

        //Assing a decode authorid to logged
        let logged = decode.authorId
        console.log(logged)
        //set the authorid in headers
        let authorId = req.headers['authorid']
        console.log(authorId)
        //return a error if decoded authorid and headers author id or not equal
        if (logged != authorId) { return res.send({ status: false, msg: "Author not allowed" }) }
        // if decoded authorid and headers author id or same calling to next function
        else { next() }
    } catch (error) {
        // return a error if any case fail on try block 
        return res.status(400).send({ status: false, msg: error.message })
    }
}

//exports a module with function
module.exports.authorize = authorize