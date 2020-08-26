module.exports = async (ctx, next) => {
    ctx.body = `
    <!doctype html>
    <html>
        <head>
            <title> SSHS Gyeopgang in Web </title>
            <meta charset="utf-8">
        </head>
        <body>
            <h1> SSHS Gyeopgang in Web </h1>
            <form action="/login" method="get">
                <p><input type="submit", value="로그인"></p>
            </form>
            <form action="/signup" method="get">
                <p><input type="submit", value="회원 가입"></p>
            </form>
            <h3> 개발자 </h3>
            <p> 조상렬 & 정현서 </p>
        </body>
    </html>
    `;
    await next();
};