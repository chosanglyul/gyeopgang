const Router = require("koa-router");
const main = require('./main')
const auth = require("./auth");
const profile = require("./profile");
const gyeopgang = require('./gyeopgang');
const subject = require('./subject');

const frontend = new Router();

frontend.get("/", main);
frontend.get("/login", auth.login).get("/signup", auth.signup);
frontend.get("/profile", profile.index).get("/profile/:code", profile.user);
frontend.get("/gyeopgang", gyeopgang);
frontend.get("/subject", subject.index);
module.exports = frontend;