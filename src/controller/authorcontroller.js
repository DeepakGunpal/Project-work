let jwt = require('jsonwebtoken')
const authorModel = require('../Model/authorModel')

//creating a Author Model
const createAuthor = async function (req, res) {
    //usin try catch block function
    try {
        const authorData = req.body;
        const errors = await validateAuthor(authorData);
        if (errors.length > 0) {
            return res.status(400).send({ status: false, msg: "some fields are missing", errors: errors })
        }
        console.log("authorData1", authorData);
        
        // creating a authorModel
        const author = await authorModel.create(authorData)
        //in response we get success fully created authorModel 
        res.status(201).send({ status: true, data: author })
    }
    catch (error) {
        // return a error if any case fail on try block 
        res.status(500).send({ status: false, msg: error.message });
    }
}

// creating login
const loginauthor = async function (req, res) {
    //using try catch block function
    try {
        //username is ny@gmail.com
        //password is 123
        //`Basic ${btoa("username:password")}`
        //`Basic ${btoa("ny2@gmail.com:123")}`
        const auth = "Basic bnlAZ21haWwuY29tOjEyMw=="; //req.headers["Authorization"];
        //split space and take 1 index value which will token/encrpted value like dXNlcjpwd2Q=
        const userPwd =  atob(auth.split(' ')[1]).split(':');
        
        // enter a email and password
        let username = req.body.email; //userPwd[0];
        let password = req.body.password; //userPwd[1];
        

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

const validateAuthor = async function (authorData) {
    const errors = [];
    if (!authorData.fname) {
        errors.push("first name required")
    }
    //return a error if lastname not present
    if (!authorData.lname) {
        errors.push("last name required")
    }
    //return a error if title not present
    if (!authorData.title) {
        errors.push("title name required")
    }
    // return a error  if email is not present
    if (!authorData.email) {
        errors.push("email is required")
    }       
    //return a error if password not present
    if (!authorData.password) {
        errors.push("password required")
    }
    //return a error if email is not valid
    if (authorData.email) {
        let validmail = !/^\w+([\.-]?\w+)@\w+([\. -]?\w+)(\.\w{2,3})+$/.test(authorData.email)
        if (validmail) {
            errors.push("email is not valid")
        }
    }    

    if (errors.length === 0) {
        //check email in authorModel
        const userEmail = await authorModel.findOne({ email: authorData.email })
        //return a error if email already exist in authorModel
        if (userEmail) {
            errors.push("email already exist")
        }
    }
    return errors;
};

//exports a module with functions

module.exports.loginauthor = loginauthor

module.exports.createAuthor = createAuthor
