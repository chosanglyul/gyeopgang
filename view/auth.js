const makeAuth = (flash, url, value) => {
    var html = ``;
    if(flash.length > 0) html += `<div style="color:red;">${flash[0]}</div>`;
    html += `<form action="${url}" method="post">
        <p><input type="text" name="code" placeholder="학번"></p>
        <p><input type="text" name="name" placeholder="이름"></p>
        <p><input type="submit", value="${value}"></p>
    </form>`;
    return html;
};

module.exports = {
    login: async (ctx, next) => {
        ctx.body = makeAuth(ctx.flash('error'), '/endpoint/login', '로그인');
        await next();
    },
    signup: async (ctx, next) => {
        ctx.body = makeAuth(ctx.flash('error'), '/endpoint/signup', '회원 가입');
        await next();
    }
}