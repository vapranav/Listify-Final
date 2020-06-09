var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var methodOverride = require("method-override");
var ObjectId = mongoose.Types.ObjectId;
var passport = require("passport")
var LocalStrategy = require("passport-local")
var passportLocalMongoose = require("passport-local-mongoose")
var Category = require("./models/categories")
var List = require("./models/lists")
var User = require("./models/user");


mongoose.connect('mongodb+srv://Pranav:Recovery72@cluster0-utu0m.mongodb.net/<dbname>?retryWrites=true&w=majority', {
	useNewUrlParser: true,
	useCreateIndex: true
}).then(() => {
		console.log('connected to db')
	}).catch(err => {
		console.log("error:", err.message);
});



app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(methodOverride("_method"));

app.use(require("express-session")({
	secret: "Football is the best!",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.get('/',(req, res) => {
	res.render("landing")
    
});

app.get("/lists", function(req, res) {
	Category.find({'username': req.user.username}).populate('listitems').exec(function (err, category) {
		if(err){
			console.log(err);
		} else {
			console.log(req.user);
			res.render("home", {categories: category, currentUser: req.user.username});
		}
	});
})


	// Category.findById("5ec7d40414765a4c28955ca5", function(err, foundCategory) {
	// 	if(err){
	// 		console.log(err);
	// 	} else {
	// 		User.findById("5ed36693aec90a52e4bbd5ca", function(err, foundUser) {
	// 			if(err){
	// 				console.log(err);
	// 			} else {
	// 				foundUser.categories.push(foundCategory)
	// 				foundUser.save(function(err, data){
	// 									if(err) {
	// 										console.log(err)
	// 									} else {
	// 										console.log(data);
	// 									}
	// 								})
	// 			}
	// 		})
	// 	}
	// })


    // Category.find({}).populate('listitems').exec(function (err, category) {
	// 	if(err){
	// 		console.log(err);
	// 	} else {
	// 		res.render("home", {categories: category, currentUser: req.user});
	// 	}
	// });

//IMPORTANT
// Category.create({
// 	name: "Films"
// }, function(err, category) {
// 	if (err) {
// 		console.log(err) 
// 	} else {
// 		console.log("saved");
// 	}
// })



// List.create({
// 	tasks: items
// }, function(err, post) {
// 	Category.findOne({name: "Films"}, function(err, foundCategory){
// 		if(err) {
// 			console.log(err);
// 		} else {
// 			foundCategory.listitems.push(post);
// 			foundCategory.save(function(err, data){
// 				if(err) {
// 					console.log(err)
// 				} else {
// 					console.log(data);
// 				}
// 			})
// 		}
// 	})
// });

app.post("/:categoryid/add", function(req, res) {
	var request = Object.values(req.body);
	var listitems = [];
	for(var i = 0; i < Object.keys(req.body).length; i++) {
		listitems.push(request[i]);
	}
	console.log(listitems)
	

for(var i = 0; i < listitems.length; i++) {
 		
	List.create({
		tasks: listitems[i]
	}, function(err, post) {
		Category.findById(req.params.categoryid, function(err, foundCategory){
			if(err) {
				console.log(err);
			} else {
				console.log("found")
				foundCategory.listitems.push(post);
				foundCategory.save(function(err, data){
					if(err) {
						console.log(err)
					} else {
						console.log(data);
					}
				})
			}
			})
		}
	)
}


res.redirect('/lists');
})

app.delete("/:taskid", function(req, res){
	List.findByIdAndRemove(req.params.taskid, function(err) {
		if(err) {
			res.send("error lol")
		} else {
			res.redirect("/lists")
		}
	})
})


app.post("/category/create", isLoggedIn, function(req, res) {
	
	var request = Object.values(req.body);
	var listitems = [];
	for(var i = 1; i < Object.keys(req.body).length; i++) {
		listitems.push(request[i]);
	}
	

Category.create({
	name: request[0],
	username: req.user.username
}, function(err, category) {
	if (err) {
		console.log(err) 
	} else {
		console.log("saved");
	}
});

for(var i = 0; i < listitems.length; i++) {
 		
	List.create({
		tasks: listitems[i]
	}, function(err, post) {
		Category.findOne({name: request[0]}, function(err, foundCategory){
			if(err) {
				console.log(err);
			} else {
				foundCategory.listitems.push(post);
				foundCategory.save(function(err, data){
					if(err) {
						console.log(err)
					} else {
						console.log(data);
					}
				})
			}
			})
		}
	)
}


res.redirect('/lists');
});



					
	

// 	category.save(function(error) {
// 		if (!error) {
// 			Category.find({})
// 				.exec(function(error, categories) {
// 					console.log(JSON.stringify(categories, null, "\t"))
// 				})
// 		}
// 	});

// 	res.redirect("/");
// });


app.get("/register", function(req, res) {
	res.render("register");
})

app.post("/register", function(req, res){
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user){
		if(err) {
			console.log(err)
			return res.render("register")
		} 	
		
			passport.authenticate("local")(req, res, function(){
			res.redirect("/lists")
		
		});
	});
});

app.get("/login", function(req, res) {
	res.render("login")
})

app.post("/login", passport.authenticate("local", {successRedirect: "/lists", failureRedirect: "/login"}), function(req, res) {		})

app.get("/logout", function(req, res){
	req.logout();
	res.redirect("/");
})

function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Works");
});



