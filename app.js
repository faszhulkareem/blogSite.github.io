var express = require("express"),
    methodOverrider = require("method-override"),
    expressSanitizer = require("express-sanitizer"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose");

//config    
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(methodOverrider("_method"));
app.use(expressSanitizer());


//mongodb connection
mongoose.connect("mongodb://localhost:27017/restful_blog_app", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

var schema = mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {
        type: Date,
        default: Date.now
    }
})

var Blog = mongoose.model("Blog", schema);



//creating a data for the db
// Blog.create({
//     title: "White Robot",
//     image: "https://images.unsplash.com/photo-1531747118685-ca8fa6e08806?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
//     body: "The first humaniod robot invented!!!"
// }, function (err, blogs) {
//     if (err) {
//         console.log(err)
//     } else {
//         console.log(blogs)
//     }
// })

//RESTful ROUTES
app.get("/blogs", function (req, res) {
    Blog.find({}, function (err, blogs) {
        if (err) {
            console.log(err)
        } else {
            res.render("index", {
                blogs: blogs
            })
        }
    })

})
//create and new forms routes

app.get("/blogs/new", function (req, res) {
    res.render("new")
});

app.post("/blogs", function (req, res) {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, function (err, newBlog) {

        if (err) {
            console.log(err)
        } else {
            res.redirect("/blogs")
        }
    });
});

//show route
app.get("/blogs/:id", function (req, res) {
    Blog.findById(req.params.id, function (err, blog) {
        if (err) {
            console.logs(err)
        } else {
            res.render("show", {
                blog: blog
            });
        }
    });

});

//edit route
app.get("/blogs/:id/edit", function (req, res) {
    Blog.findById(req.params.id, function (err, foundBlog) {
        if (err) {
            console.log(err)
        } else {
            res.render("edit", {
                blog: foundBlog
            })
        }
    })
})
//update route
app.put("/blogs/:id", function (req, res) {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function (err, foundBlog) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    })
})

//delete route
app.delete("/blogs/:id", function (req, res) {
    Blog.findByIdAndRemove(req.params.id, function (err, foundBlog) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/blogs");
        }
    })
})

app.listen(8000, function () {
    console.log("listening in port 8000...")
});