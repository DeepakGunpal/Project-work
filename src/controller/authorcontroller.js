const authorModel = require('../Model/authorModel')

const createAuthor = async function (req, res) {
    try {
        const fname = req.body.fname
        const lname = req.body.lname
        const title = req.body.title
        const email = req.body.email
        const password = req.body.password
        const userEmail = await authorModel.findOne({ email: email })
        
        if (!fname) {
            return res.status(400).send({ status: false, msg: "first name required" })
        }
        if (!lname) {
            return res.status(400).send({ status: false, msg: "last name required" })
        }
        if (!title) {
            return res.status(400).send({ status: false, msg: "title name required" })
        }
        let validmail = !/^\w+([\.-]?\w+)@\w+([\. -]?\w+)(\.\w{2,3})+$/.test(email)
      
        if(validmail){
            return res.status(400).send({ status: false, msg: "email is not valid" })
        }
        //email
        if (userEmail) {
            return res.status(400).send({ msg: "user already exist" })
        }
        if (!password) {
            return res.status(400).send({ status: false, msg: "enter password" })
        }
        const data = req.body
        const author = await authorModel.create(data)
        res.status(201).send({ status: true, msg: author })
    } catch (error) {
        res.status(500).send({ status: false, msg: error.message });

    }
}


module.exports.createAuthor = createAuthor
