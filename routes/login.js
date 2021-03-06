const express = require("express");
const router = express.Router();
//const bcrypt = require('bcrypt');

// A middleware function with no mount path. This code is executed for every request to the router
router.use(function (req, res, next) {
  next();
});

module.exports = (db) => {
  router.get("/", (req, res) => {
    res.render("login");
  });

  /*
    This function checks whether the email
    exists in the database
  */
  const emailExist = function (email) {
    return db
      .query(
        `
    SELECT *
    FROM users
    WHERE email = $1;
    `,
        [email]
      )
      .then((res) => res.rows[0]);
  };

  /*
    If the user is not logged in, this post
    route helps user to login with valid
    credentials (email,password)
  */
  router.post("/", (req, res) => {
    const email = req.body.email;
    emailExist(email).then((user) => console.log(user));
    return emailExist(email)
      .then((user) => {
        if (user) {
          if (req.body.password === user.password) {
            req.session.email = user.email;
            req.session.name = user.id;
            res.redirect("/home");
          } else {
            let templateVars = { errMessage: "Incorrect Password!" };
            res.render("errors_msg", templateVars);
          }
        } else {
          let templateVars = { errMessage: "Email does not exist!" };
          res.render("errors_msg", templateVars);
        }
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  return router;
};

// if (!bcrypt.compareSync(req.body.password, user.password)) {
//   console.log(req.body.password, user.password);
//   res.send({error: "incorrect password"})
// } else {
// req.session.email = user.email;
// res.redirect('/');
