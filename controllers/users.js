const User = require("../models/user")
// render signup form
module.exports.renderSignupForm = (req, res) => {
  res.render("users/signup.ejs");
};

// signup route (create review)
module.exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const newUser = new User({ username, email });
    let registeredUser = await User.register(newUser, password);
    // console.log(registeredUser);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to DreamCorner");
      res.redirect("/listings");
    });
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/signup");
  }
};

//   render login form (show login form)
module.exports.renderLoginForm = (req, res) => {
  res.render("users/login.ejs");
};

//   login
module.exports.login = async (req, res) => {
  req.flash("success", "Welcome back to DreamCorner");
  let redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

// logout
module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You are logged out!");
    res.redirect("/listings");
  });
};
