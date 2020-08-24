const Router = require("koa-router");

const main = new Router();
main.get("/", require('./main'));
module.exports = main;