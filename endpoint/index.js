const Router = require("koa-router");
const passport = require("koa-passport");
const isNumber = require("../lib/isNumeric");
const LocalStrategy = require("passport-local").Strategy;

const signup = require('./signup');
const subject = require('./subject');

const endpoint = new Router();

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    console.log(user);
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

endpoint.use(passport.initialize()).use(passport.session());
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