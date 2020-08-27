const excludepath = ['/', '/login', '/signup', '/endpoint/signup', '/endpoint/login'];

module.exports = async (ctx, next) => {
    if(!(excludepath.includes(ctx.request.path) || ctx.isAuthenticated())) {
        ctx.flash('error', '로그인이 필요합니다.');
        return ctx.redirect('/login');
    }
    await next();
}