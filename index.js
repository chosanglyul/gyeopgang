require("dotenv").config();
const Koa = require("koa");
const Router = require("koa-router");
const session = require("koa-session");
const bodyParser = require('koa-bodyparser');

const frontend = require("./view");
const endpoint = require("./endpoint");
const getDB = require("./lib/getdb");

const router = new Router();
const app = new Koa();
const PORT = 3000;

router.use(frontend.routes());
router.use('/endpoint', endpoint.routes());

app.keys = ["pebble-secret-key"];
app.use(bodyParser()).use(session(app)).use(getDB);
app.use(router.routes()).use(router.allowedMethods());

app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));