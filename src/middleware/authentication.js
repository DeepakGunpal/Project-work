const jwt = require('jsonwebtoken');
const authorModel = require('../Model/authorModel');

//creating authentication using middleware
const authentication = async function (req, res, next) {
    //using try catch block function
    try {
        //  body contains email and password 
        let username = req.body.email
        let password = req.body.password

        //return a error if email is not present
        if (!username) {
            return res.status(400).send({ status: false, msg: "Enter email address" })
        }

        //email validation
        let validmail = !/^\w+([\.-]?\w+)@\w+([\. -]?\w+)(\.\w{2,3})+$/.test(username)
        //return error if email is notvalid
        if (validmail) {
            return res.status(400).send({ status: false, msg: "email is not valid" })
        }

        //assinging a headers token to token variable
        let token = req.headers["x-Api-Key"];
        //check token in lowercase
        if (!token) token = req.headers["x-api-key"]

        //return a error message if token is not present
        if (!token) {
            return res.status(404).send({ status: false, msg: "Token must be present" })
        }
        // verify the token and assing to decode variable
        let decode = jwt.verify(token, "group40-phase2");
        console.log(decode)
        //return error if decode token is not valid
        if (!decode) {
            return res.status(403).send({ status: false, msg: "Invalid Token" })
        }
        //Assing a decode authorid to authenticAuthorId
        const authenticAuthorId = decode.authorId
        //check the authenticAuthorId in authorModel
        const authenticAuthor = await authorModel.findById({ _id: authenticAuthorId })
        //return error if authenticAuthorId is not precent in authorModel
        if (!authenticAuthor) {
            return res.status(400).send({ status: false, msg: "Author does not exist" });
        }
        //return erroe if the email and password present in authorModel
        if (username != authenticAuthor.email || password != authenticAuthor.password) {
            return res.status(400).send({ status: false, msg: "Authentication failed" });
        }
        // calling next function
        next()

    } catch (error) {
        // return a error if any case fail on try block 
        res.status(500).send({ status: false, msg: error.message });

    }
}

//exports a module with function
module.exports.authentication = authentication