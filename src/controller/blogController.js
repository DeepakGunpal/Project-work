// require a blogModel from model folder and assing to blogModel variable
const blogModel = require("../Model/blogModel");
// require a authorModel from model folder and assing to authorModel variable
const authorModel = require("../Model/authorModel");

// creating a blog using asnyc function
const createBlog = async function (req, res) {
  //using try catch function
  try {
    //assing a body data to data variable
    const data = req.body;
    //assing a authorId in a body to auth variable
    const auth = data.authorId;
    //assing a title in a body to title variable
    const title = req.body.title;
    //assing a body in a body to body variable
    const body = req.body.body;
    //assing a category in a body to category variable
    const category = req.body.category;

    //return a error if title is not present
    if (!title) {
      return res.status(400).send({ status: false, msg: "Title is required" });
    }
    //return a error if body is not present
    if (!body) {
      return res.status(400).send({ status: false, msg: "Body is required" });
    }
    //return a error if auth is not present
    if (!auth) {
      return res.status(400).send({ status: false, msg: "Authorid is required" });
    }
    //return a error if category is not present
    if (!category) {
      return res.status(400).send({ status: false, msg: "Category is required" });
    }
    //finding a authorId in authorModel
    const id = await authorModel.findById(auth);
    //return error if authorId not present inauthorModel
    if (!id) {
      return res.status(400).send({ status: false, msg: "Author does not exist" });
    }
    //creating a blogModel and assing to saveData variable
    const savedData = await blogModel.create(data);
    //response for sucessfully created blog
    res.status(201).send({ status: true, msg: savedData });
  } catch (error) {
    // return a error if any case fail on try block 
    res.status(500).send({ status: false, msg: error.message });
  }
};

//getblog using async function
const getblog = async function (req, res) {
  //using try catch function
  try {
    //getting a all blogs with the condition isDeleted: false and isPublished: true , populate with authorid
    const blog = await blogModel.find({
      $and: [{ isDeleted: false }, { isPublished: true }],
    }).populate('authorId');
    console.log(blog);
    //return error if no blog is present with matching condition
    if (blog.length === 0) {
      return res.status(404).send({ status: false, msg: "NOT found" });
    }
    ////response for sucessfully getting a blog
    res.status(200).send({ status: true, msg: blog });
  } catch (error) {
    // return a error if any case fail on try block 
    res.status(500).send({ status: false, msg: error.message });
  }
};

//---------------------------------------------------////////////

//flitering a blog  using async function
const filterblog = async function (req, res) {

  try {
    //assing a category in query to cat variable
    const cat = req.query.category;
    console.log(cat)
    //assing a subcategory in query to subcategory variable
    const subcat = req.query.subcategory;
    //assing a tags in query to tags variable
    const tag = req.query.tags;
    console.log(tag)
    //assing  query to query variable
    const query = req.query;
    //assing a authorId in query to id variable
    const id = query.authorId;

    //checking  authorid by finding in authorModel
    if (id) {
      const validauthor = await authorModel.findById({ _id: id }).select({ _id: 1 });
      // console.log(validauthor)
      //return error if authorid not present
      if (!validauthor)
        return res.status(400).send({ status: false, msg: "Author does not exist" });
    }
    //checking the category by finding in blogModel
    if (cat) {
      const validcat = await blogModel.find({ category: cat });
      console.log(validcat)
      //return error if no category present
      if (validcat.length == 0) {
        return res.status(400).send({ status: false, msg: "category does not exist " });
      }
    }
    //checking the tags by finding in blogModel
    if (tag) {
      const validtag = await blogModel.find({ tags: tag });
      console.log(validtag)
      //return error if no tags present
      if (validtag.length == 0) {
        return res.status(400).send({ status: false, msg: "tag does not exist " });
      }
    }
    //checking the subcategory by finding in blogModel
    if (subcat) {
      const validsubcategory = await blogModel.find({ subcategory: subcat });
      //return error if no subcategory present
      if (validsubcategory.length == 0) {
        return res.status(400).send({ status: false, msg: "subcategory does not exist " });
      }
    }
    //assing a authorId ,category,tags ,subcategory in query to query variable
    const { authorId, category, tags, subcategory } = query;
    //finding a query in blogeModel
    const blog = await blogModel.find(query).populate('authorId');
    console.log(blog);
    console.log(blog.length);
    // return a erroe if no blog is present
    if (blog.length === 0) {
      // return response for not found
      return res.status(404).send({ status: false, msg: "NOT found" });
    }
    // return a sucess full responce
    res.status(200).send({ status: true, msg: blog });
  } catch (error) {
    // return a error if any case fail on try block 
    res.status(500).send({ status: false, msg: error.message });
  }
};

//update a blogModel using async function
const updatedModel = async function (req, res) {
  try {
    //assing a blogid in a param to id variable
    let id = req.params.blogId
    console.log(id)
    //finding a id with isDeleted: false condition in blogModel
    let blog = await blogModel.findOne({ $and: [{ _id: id }, { isDeleted: false }] })
    //return error if blog not present
    if (!blog) {
      return res.send({ status: false, message: "blog doesnt exist" })
    }

    //assing a title in a body to title in a blog
    if (req.body.title) {
      blog.title = req.body.title
    }
    //assing a body in a body to body in a blog
    if (req.body.body) {
      blog.body = req.body.body
    }
    //assing a tags in a body to tags in a blog
    if (req.body.tags) {
      let temp1 = blog.tags
      temp1.push(req.body.tags)
      blog.tags = temp1

    }
    //assing a subcategory in a body to subcategory in a blog
    if (req.body.subcategory) {
      let temp2 = blog.subcategory
      temp2.push(req.body.subcategory)
      blog.subcategory = temp2
    }
    //save the upadated values 
    blog.save()
    //return a sucessfull responce on filtering blog
    res.status(200).send({ status: true, msg: blog })


  }
  catch (err) {
    // return a error if any case fail on try block 
    res.status(500).send({ msg: err.message })
  }
}

// uodating a ispublished in blogModel using async function
const publisheblog = async function (req, res) {
  //assing blogid in a params to id variable
  let id = req.params.blogId
  // finding a blogid with isDeleted: false condition in blogModel
  let blog = await blogModel.findOne({ $and: [{ _id: id }, { isDeleted: false }] })
  //return error if blog not present
  if (!blog) {
    return res.send({ status: false, message: "blog doesnt exist" })
  }
  //return erroe isPublished if alredy exist
  if (blog.isPublished == true) {
    return res.status(404).send({ status: false, message: "blog  already published" })
  }
  //set a newdate to publishedAt in blogModel
  blog.publishedAt = new Date(Date.now())
  //set a true to isPublished in blogModel
  blog.isPublished = true
  //save updated blog
  blog.save()
  //return succesfull responce 
  res.status(200).send({ status: true, msg: blog })

}

//deleting a blog using async function
const deleteblog = async function (req, res) {
  try {
    //assing blogid in a params to id variable
    const id = req.params.blogId
    // finding a blogid with isDeleted: false condition in blogModel
    const blog = await blogModel.findOne({ $and: [{ _id: id }, { isDeleted: false }] })
    //if blog is present and update a blog and set true to isDeleted and new Date deletedAt
    if (blog) {
      const deletedblog = await blogModel.findByIdAndUpdate({ _id: id }, { $set: { isDeleted: true, deletedAt: new Date(Date.now()) } }, { new: true })
      return res.status(200).send({ status: true, msg: deletedblog })
    }
    //return error if blog not present
    res.status(404).send({ status: false, msg: "Blog does not exist" })

  } catch (error) {
    // return a error if any case fail on try block 
    res.status(500).send({ status: false, msg: error.message })
  }

}

const deletebyquery = async function (req, res) {
  try {
    //assing query to  queryparam variable
    const queryparam = req.query
    //assing a authorId ,category,tags ,subcategory, isPublished in query to queryparam variable
    const { category, authorId, tags, subcategory, isPublished } = queryparam
    console.log(queryparam)
    //finding queryparam in blogModel and select with title have only one
    const blog = await blogModel.find(queryparam).select({ title: 1, _id: 0 })
    console.log(blog)
    // console.log(blog[0].title)

    //return error if blog is not present
    if (blog.length === 0) {
      return res.status(404).send({ status: false, message: "blog does not exist" })
    }

    //Declared empty array
    let arrayOfBlogs = []
    //for loop to store all the blog to delete
    for (let i = 0; i < blog.length; i++) {
      let blogid = blog[i].title
      arrayOfBlogs.push(blogid)
    }
    console.log(arrayOfBlogs)

   // assing a new date to date variable
    const date = new Date(Date.now())
    //update a blog with include arrayOfBlogs and set date to deletedAt and true to isDeleted
    const deleteblogs = await blogModel.updateMany({ title: { $in: arrayOfBlogs } },
      { $set: { deletedAt: date, isDeleted: true } },
      { new: true })
    console.log(deleteblogs)
  // return a sucesccfull responce on deletedblogs
    res.status(200).send({ status: true, msg: deleteblogs })

  } catch (error) {
    // return a error if any case fail on try block 
    res.status(500).send({ status: false, msg: error.message })

  }
}

//exports a module with functions
module.exports.createBlog = createBlog;
module.exports.getblog = getblog;
module.exports.filterblog = filterblog;
module.exports.updatedModel = updatedModel
module.exports.publisheblog = publisheblog
module.exports.deleteblog = deleteblog
module.exports.deletebyquery = deletebyquery 
