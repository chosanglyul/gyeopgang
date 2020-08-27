const makeButton = require('../lib/makeButton');

const makeMain = (flash, isAuth) => {
    var html = `
    <!doctype html>
    <html>
        <head>
            <title> SSHS Gyeopgang in Web</title>
            <meta charset="utf-8">
        </head>
        <body>
    `;
    if(flash.length > 0) html += `<div style="color:green;">${flash[0]}</div>`;
    html += `<h1> SSHS Gyeopgang in Web - Beta</h1>`;
    if(isAuth) {
        html += makeButton('/profile', 'GET', '마이페이지');
        html += makeButton('/endpoint/logout', 'POST', '로그아웃');
    } else {
        html += makeButton('/login', 'GET', '로그인');
        html += makeButton('/signup', 'GET', '회원 가입');
    }
    html += `<h3> 개발자 </h3>
            <p> 조상렬 & 정현서 </p>
        </body>
    </html>`;
    return html;
};

module.exports = async (ctx, next) => {
    ctx.body = makeMain(ctx.flash('success'), ctx.isAuthenticated());
    await next();
};