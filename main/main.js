module.exports = async (ctx, next) => {
    ctx.body = `
    <!doctype html>
    <html>
        <head>
            <title> Welcome </title>
            <meta charset="utf-8">
        </head>
        <body>
            <h1><a href="/">WEB</a></h1>
            <h1> Welcome </h1>
            <h2> SSHS Gyeopgang in Web </h2>
        </body>
    </html>
    `;
    await next();
};