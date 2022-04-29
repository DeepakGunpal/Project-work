let jwt = require('jsonwebtoken')//Import jwt
const authorModel = require('../Model/authorModel')//Import authorModel

//create author function
const createAuthor = async function (req, res) {
    try {
        //Reading inputs from req.body
        const fname = req.body.fname
        const lname = req.body.lname
        const title = req.body.title
        const email = req.body.email
        const password = req.body.password

        //Mandotory fields
        if (!fname) {
            return res.status(400).send({ status: false, msg: "first name required" })
        }
        if (!lname) {
            return res.status(400).send({ status: false, msg: "last name required" })
        }
        if (!title) {
            return res.status(400).send({ status: false, msg: "title name required" })
        }
        if (!password) {
            return res.status(400).send({ status: false, msg: "enter password" })
        }

        //check name format
        let validName =  !/^[a-zA-Z ]{2,30}$/.test(fname) || !/^[a-zA-Z ]{2,30}$/.test(lname) 
        if(validName) {
            return res.status(400).send({ status: false, msg: "Name must be in alphabets" })
        }

        // let validFname =  !/^[a-zA-Z ]{2,30}$/.test(fname)
        // if(validName) {
        //     return res.status(400).send({ status: false, msg: "Name must be in alphabets" })
        // }

        // let validName =  !/^[a-zA-Z ]{2,30}$/.test((fname && lname))
        // if(validName) {
        //     return res.status(400).send({ status: false, msg: "Name must be in alphabets" })
        // }

        //check email format
        let validmail = !/^\w+([\.-]?\w+)@\w+([\. -]?\w+)(\.\w{2,3})+$/.test(email)

        if (validmail) {
            return res.status(400).send({ status: false, msg: "email is not valid" })
        }

        //Unique mail validation - reading wether author already exists with entered email
        const userEmail = await authorModel.findOne({ email: email })

        if (userEmail) {
            return res.status(400).send({ msg: "user already exist" })
        }

        //check password format
        let validPassword = !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)

        if(validPassword) {
            return res.status(400).send({ status: false, msg: "Weak Password" })
        }


        //Reading inputs from req.body
        const data = req.body
        //Create author
        const author = await authorModel.create(data)
        //send created author in response
        res.status(201).send({ status: true, msg: author })

    } catch (error) {
        res.status(500).send({ status: false, msg: error.message });

    }
}


//login function
const loginauthor = async function (req, res) {
    try {
        //Reading email and password
        let username = req.body.email
        let password = req.body.password

        //check email format
        let validmail = !/^\w+([\.-]?\w+)@\w+([\. -]?\w+)(\.\w{2,3})+$/.test(username)

        if (validmail) {
            return res.status(400).send({ status: false, msg: "email is not valid" })
        }

        //Require password
        if (!password) {
            return res.status(400).send({ status: false, msg: "enter password" })
        }

        //find author with input credential
        let author = await authorModel.findOne({ email: username, password: password })
        if (!author) {
            return res.status(401).send({ status: false, msg: "Invalid credential" })
        }

        //Token generation with authorId and a secret key
        let token = jwt.sign({
            authorId: author._id.toString(),
            group: "40",
            Project: "Blog"
        }, "group40-phase2");
        console.log(token)
        res.setHeader['x-api-key']
        res.send({ status: true, msg: token })

    } catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }

}

//Export function
module.exports.loginauthor = loginauthor
module.exports.createAuthor = createAuthor
