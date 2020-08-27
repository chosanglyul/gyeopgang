const Router = require("koa-router");
const passport = require("koa-passport");

const signup = require('./signup');
const subject = require('./subject');
const usersubject = require('./usersubject');

const endpoint = new Router();

endpoint.post("/login", passport.authenticate('local', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    successFlash: true,
    failureFlash: true
}));
endpoint.post("/logout", async (ctx, next) => {
    await ctx.logout();
    ctx.flash('success', '로그아웃에 성공하였습니다.');
    return ctx.redirect('/');
});
endpoint.use("/signup", signup.common).post("/signup", signup.post);//.delete("/signup", signup.delete);
endpoint.post("/usersubject/add", usersubject.add).post("/usersubject/delete", usersubject.delete).post("/usersubject/patch", usersubject.patch);
//endpoint.use("/subject/:code", subject.common).delete("/subject/:code", subject.delete);
//endpoint.post("/subject", subject.post);

module.exports = endpoint;