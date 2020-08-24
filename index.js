require("dotenv").config();
const Koa = require("koa");
const session = require("koa-session");

const frontend = require("./frontend");
const auth = require("./auth");
const main = require('./main');
const getDB = require("./lib/getdb");

const app = new Koa();
const PORT = 3000;

app.keys = ["pebble-secret-key"];

app.use(session(app)).use(getDB);
app.use(main.routes()).use(main.allowedMethods());
app.use(frontend.routes()).use(frontend.allowedMethods());
app.use(auth.routes()).use(auth.allowedMethods());

const server = app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));

module.exports = server;