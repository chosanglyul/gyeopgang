const Router = require("koa-router");
const signup = require('./signup');
const auth = new Router();
const koaBody = require("koa-body");
const passport = require("koa-passport");
require("./config");

auth.use(koaBody()).use(passport.initialize()).use(passport.session());
auth.post("/login", passport.authenticate("local"));
auth.use("/signup/:code", signup.common).post("/signup/:code", signup.post).delete("/signup/:code", signup.delete);

module.exports = auth;