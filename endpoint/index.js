const Router = require("koa-router");
const passport = require("koa-passport");

const signup = require('./signup');
const subject = require('./subject');

const endpoint = new Router();

endpoint.post("/login", passport.authenticate('local', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true
}));
endpoint.use("/signup", signup.common).post("/signup", signup.post).delete("/signup", signup.delete);
endpoint.post("/add_subject", signup.patch);
endpoint.use("/subject/:code", subject.common).delete("/subject/:code", subject.delete);
endpoint.post("/subject", subject.post);

module.exports = endpoint;