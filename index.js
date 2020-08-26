require("dotenv").config();
const Koa = require("koa");
const Router = require("koa-router");
const session = require("koa-session");
const bodyParser = require('koa-bodyparser');
const passport = require("koa-passport");
const LocalStrategy = require("passport-local").Strategy;

const frontend = require("./view");
const endpoint = require("./endpoint");
const getDB = require("./lib/getdb");
const withAuth = require("./lib/withAuth");
const isNumber = require("./lib/isNumeric");

const router = new Router();
const app = new Koa();
const PORT = 3000;

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

passport.use('local', new LocalStrategy({
    usernameField: 'code',
    passwordField: 'name',
    passReqToCallback: true
}, async ({ ctx }, code, name, done) => {
    if(!isNumber(code, "4")) done(null, false, { message: "등록되지 않은 학번입니다." });
    const user = await ctx.state.collection.users.findOne({ code: parseInt(code, 10) });
    if(!user) done(null, false, { message: "등록되지 않은 학번입니다." });
    if(name !== user.name) done(null, false, { message: "이름이 일치하지 않습니다." });

    done(null, user);
}));
router.use(bodyParser()).use(session(app)).use(getDB);
router.use(passport.initialize()).use(passport.session()).use(withAuth);
router.use(frontend.routes());
router.use('/endpoint', endpoint.routes());

app.keys = ["pebble-secret-key"];
app.use(router.routes()).use(router.allowedMethods());

app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));