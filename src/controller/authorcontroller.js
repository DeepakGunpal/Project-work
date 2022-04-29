let jwt = require('jsonwebtoken')
const authorModel = require('../Model/authorModel')

//creating a Author Model
const createAuthor = async function (req, res) {
    //usin try catch block function
    try {
        // assing a  fname in body  to fname variable
        const fname = req.body.fname
        // assing a lname in body  to lname variable
        const lname = req.body.lname
        // assing a title in body  to title variable
        const title = req.body.title
        // assing a email in body  to email variable
        const email = req.body.email
        // assing a password in body  to password variable
        const password = req.body.password

        //return a error if firstname not present
        if (!fname) {
            return res.status(400).send({ status: false, msg: "first name required" })
        }
        //return a error if lastname not present
        if (!lname) {
            return res.status(400).send({ status: false, msg: "last name required" })
        }
        //return a error if title not present
        if (!title) {
            return res.status(400).send({ status: false, msg: "title name required" })
        }
        // return a error  if email is not present
        if (!email) {
            return res.status(400).send({ status: false, msg: "email is required" })
        }
        //check valid mail
        let validmail = !/^\w+([\.-]?\w+)@\w+([\. -]?\w+)(\.\w{2,3})+$/.test(email)
        // return a error if email is not valid
        if (validmail) {
            return res.status(400).send({ status: false, msg: "email is not valid" })
        }
        //return a error if password not present
        if (!password) {
            return res.status(400).send({ status: false, msg: "enter password" })
        }
        //check email in authorModel
        const userEmail = await authorModel.findOne({ email: email })
        //return a error if email already exist in authorModel
        if (userEmail) {
            return res.status(400).send({ msg: "user already exist" })
        }
        //assinging body dat to data variable
        const data = req.body
        // creating a authorModel
        const author = await authorModel.create(data)
        //in response we get success fully created authorModel 
        res.status(201).send({ status: true, msg: author })
    } catch (error) {
        // return a error if any case fail on try block 
        res.status(500).send({ status: false, msg: error.message });

    }
}


// creating login
const loginauthor = async function (req, res) {
    //using try catch block function
    try {
        // enter a email and password
        let username = req.body.email
        let password = req.body.password

        // return a error  if email is not present
        if (!username) {
            return res.status(400).send({ status: false, msg: "email is required" })
        }
        // return a error if password is not present
        if (!password) {
            return res.status(400).send({ status: false, msg: "password is required" })
        }
        //check valid mail
        let validmail = !/^\w+([\.-]?\w+)@\w+([\. -]?\w+)(\.\w{2,3})+$/.test(username)
        // return a error if email is not valid
        if (validmail) {
            return res.status(400).send({ status: false, msg: "email is not valid" })
        }
        // check the email and paswword in authorModel
        let author = await authorModel.findOne({ email: username, password: password })
        //return an error if email&password or not found in authorModel
        if (!author) {
            return res.status(401).send({ status: false, msg: "email and password or not match" })
        }
        // creating a jwt token
        let token = jwt.sign({
            authorId: author._id.toString(),
            group: "40",
            Project: "Blog"
        }, "group40-phase2");
        console.log(token)
        // set token to header
        res.setHeader['x-api-key']
        //In response   jwt token created
        res.send({ status: true, msg: token })

    } catch (error) {
        // return a error if any case fail on try block 
        res.status(500).send({ status: false, msg: error.message })
    }

}


//exports a module with functions

module.exports.loginauthor = loginauthor

module.exports.createAuthor = createAuthor
