const { ObjectId } = require("mongodb");
const isNumber = require("../lib/isNumeric");
const passport = require("koa-passport");
const LocalStrategy = require("passport-local").Strategy;

passport.serializeUser(({ ctx }, user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async ({ ctx }, _id, done) => {
    try {
        const user = await ctx.state.collection.users.findOne({ _id: ObjectId(_id) });
        done(null, user);
    } catch(e) {
        done(e);
    }
});

passport.use(new LocalStrategy({
    usernameField: "code",
    passwordField: "name",
    passReqToCallback: true,
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}, async ({ ctx }, code, name, done) => {
    if(!isNumber(code, "4")) done(null, false);
    const user = await ctx.state.collection.users.findOne({ code: parseInt(code, 10) });
    if(!user || name !== user.name) { done(null, false); }

    done(null, user);
}));