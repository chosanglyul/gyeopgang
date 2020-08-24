const Router = require("koa-router");
const login = require("./login");
const profile = require("./profile");
const find = require('./find');

const frontend = new Router();

frontend.use("/login", login);
frontend.use("/profile/:code", profile);
frontend.use("/find/:code", find);
module.exports = frontend;